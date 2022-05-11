(function () {

    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

    function AudioRecorder() {

        var is_recording_ = false;
        var media_recorder_wrapper_ = null;

        function MediaRecorderWrapper(user_media_stream) {

            var self = this;
            var user_media_stream_ = user_media_stream;
            var recorder_mime_type_ = 'audio/webm';
            var media_recorder_ = null;
            var is_recording_ = false;
            var record_timer_ = null;

            this.start = function (record_time_ms) {
                if (is_recording_) {
                    stop();
                }
                is_recording_ = true;

                if (user_media_stream_.getAudioTracks().length <= 0) {
                    console.error("user_media_stream_.getAudioTracks().length <= 0");
                    return false;
                }

                var media_stream = new window.MediaStream();
                media_stream.addTrack(user_media_stream_.getAudioTracks()[0]);

                var recorder_hints = {
                    mimeType: recorder_mime_type_
                };

                // http://dxr.mozilla.org/mozilla-central/source/content/media/MediaRecorder.cpp
                // https://wiki.mozilla.org/Gecko:MediaRecorder
                // https://dvcs.w3.org/hg/dap/raw-file/default/media-stream-capture/MediaRecorder.html
                // starting a recording session; which will initiate "Reading Thread"
                // "Reading Thread" are used to prevent main-thread blocking scenarios
                media_recorder_ = new MediaRecorder(media_stream, recorder_hints);
                if (!media_recorder_ ||
                    ('canRecordMimeType' in media_recorder_ && media_recorder_.canRecordMimeType(recorder_mime_type_) === false)) {
                    console.warn('MediaRecorder API seems unable to record mimeType:', recorder_mime_type_);
                    return false;
                }

                // i.e. stop recording when <video> is paused by the user; and auto restart recording
                // when video is resumed. E.g. yourStream.getVideoTracks()[0].muted = true; // it will auto-stop recording.
                //mediaRecorder.ignoreMutedMedia = self.ignoreMutedMedia || false;
                // Dispatching OnDataAvailable Handler
                media_recorder_.ondataavailable = function (e) {
                    if (!is_recording_) {
                        console.log("MediaRecorderWrapper record have stopped.");
                        return;
                    }

                    var ret = {"status": 0, "data": new Blob([e.data], {type: recorder_mime_type_})};
                    if (!e.data || !e.data.size || e.data.size < 26800) {
                        ret = {"status": -1, "data": "Your Browser Can Not Record Audio"};
                    }

                    self.ondataavailable(ret);
                };

                media_recorder_.onerror = function (error) {
                    console.error(error);
                    self.ondataavailable({"status": -1, "data": "Your Browser Can Not Record Audio, " + error});
                };

                // void start(optional long mTimeSlice)
                // The interval of passing encoded data from EncodedBufferCache to onDataAvailable
                // handler. "mTimeSlice < 0" means Session object does not push encoded data to
                // onDataAvailable, instead, it passive wait the client side pull encoded data
                // by calling requestData API.
                try {
                    media_recorder_.start();
                } catch (e) {
                    console.error(e);
                    return false;
                }

                record_timer_ = setInterval(function () {
                    if (!is_recording_) {
                        return;
                    }

                    if (!media_recorder_) {
                        return;
                    }
                    if (media_recorder_.state === 'recording') {
                        media_recorder_.requestData();
                    }
                }, record_time_ms);

                return true;
            };

            this.stop = function () {
                console.log("MediaRecorderWrapper stop");
                if (!is_recording_) {
                    return;
                }
                is_recording_ = false;

                if (record_timer_) {
                    clearInterval(record_timer_);
                    record_timer_ = null;
                }

                if (media_recorder_ && media_recorder_.state === 'recording') {
                    media_recorder_.stop();
                    try {
                        user_media_stream_.getAudioTracks()[0].stop();
                    } catch (e) {
                        console.error(e);
                    }
                }
            };

            this.ondataavailable = function (blob) {
                console.log('recorded-blob', blob);
            };
        }

        this.stop = function () {
            console.log("AudioRecorder stop");
            if (media_recorder_wrapper_ != null) {
                media_recorder_wrapper_.stop();
            }
            is_recording_ = false;
        };

        this.start = function (record_time_ms, on_data_available_callback) {
            console.log("AudioRecorder start");

            if (is_recording_) {
                console.log("is_recording_=" + is_recording_);
                stop();
            }
            is_recording_ = true;

            chrome.tabCapture.capture({
                audio: true,
                video: false
            }, function (audio_stream) {
                try {
                    console.log(audio_stream);
                    var audio_ctx = new window.AudioContext();
                    var source = audio_ctx.createMediaStreamSource(audio_stream);
                    source.connect(audio_ctx.destination);

                    media_recorder_wrapper_ = new MediaRecorderWrapper(audio_stream);

                    media_recorder_wrapper_.ondataavailable = function (audio_buffer_obj) {
                        on_data_available_callback(audio_buffer_obj);
                    };

                    if (!media_recorder_wrapper_.start(record_time_ms)) {
                        on_data_available_callback({"status": -1, "data": "Your Browser Can Not Record Audio"});
                    }
                } catch (ex) {
                    console.log(ex);
                    on_data_available_callback({
                        "status": -1,
                        "data": "Your Browser Can Not Record Audio"
                    });
                }
            });
        };
    }

    function StorageHelper() {

        function get_history_datas(on_result_callback) {
            chrome.storage.local.get('history_datas', function (datas) {
                on_result_callback(datas['history_datas']);
            });
        }

        function get_device_id(on_result_callback) {
            chrome.storage.sync.get("device_id", function (datas) {
                var device_id = datas['device_id'];
                if (!device_id) {
                    device_id = parseInt(Math.random() * 100000) + "_" + new Date().getTime();
                    chrome.storage.sync.set({
                        "device_id": device_id
                    }, function () {
                        console.log(chrome.runtime.lastError);
                    });
                }
                on_result_callback(device_id);
            });
        }

        function add(item) {
            if (!item) {
                return;
            }
            get_history_datas(function (history_datas) {
                if (!history_datas) {
                    history_datas = [];
                }
                history_datas.unshift(item);
                console.log(history_datas);
                chrome.storage.local.set({
                    "history_datas": history_datas
                }, function () {
                    console.log(chrome.runtime.lastError);
                });
            });
        }

        function get_history_datas_with_csvblob(on_result_callback) {
            get_history_datas(function (datas) {
                datas.forEach((item, index, array) => {
                    item['detail_url'] = "https://www.doreso.com/" + item['acr_id'] + "?utm_source=chrome&utm_medium=extension";
                });
                var headers = [
                    {
                        column: "acr_id",
                        title: "ACR_ID",
                    },
                    {
                        column: "title",
                        title: "Title"
                    },
                    {
                        column: "artist",
                        title: "Artists"
                    },
                    {
                        column: "timestamp",
                        title: "Time",
                        formatter: function (value) {
                            // if (value.includes(":")) {
                            //     return value;
                            // }
                            var newDate = new Date();
                            newDate.setTime(parseInt(value));
                            return newDate.format("yyyy.MM.dd hh:mm:ss");
                        }
                    },
                    {
                        column: "tab_url",
                        title: "Source_URL"
                    },
                    {
                        column: "detail_url",
                        title: "Detail_URL"
                    }
                ];

                const BOM = '\uFEFF';
                let columnDelimiter = ',';
                let rowDelimiter = '\r\n';
                let csv = headers.reduce((previous, header) => {
                    return (previous ? previous + columnDelimiter : '') + (header.title || header.column);
                }, '');
                if (Array.isArray(datas) && datas.length > 0) {
                    let columns = headers.map(header => header.column);
                    csv = datas.reduce((previous, row) => {
                        let rowCsv = columns.reduce((pre, column) => {
                            if (row.hasOwnProperty(column)) {
                                let cell = row[column];
                                if (cell != null) {
                                    let header = headers.find(item => item.column == column);
                                    if (header.formatter != null && typeof (header.formatter) == "function") {
                                        cell = header.formatter(cell);
                                    }
                                    if (cell != null) {
                                        cell = cell.toString().replace(new RegExp(rowDelimiter, 'g'), ' ');
                                        cell = new RegExp(columnDelimiter).test(cell) ? `"${cell}"` : cell;
                                        return pre ? pre + columnDelimiter + cell : pre + cell;
                                    }
                                }
                                return pre ? pre + columnDelimiter : pre + " ";
                            } else {
                                return pre ? pre + columnDelimiter : pre + " ";
                            }
                        }, '');
                        return previous + rowDelimiter + rowCsv;
                    }, csv);
                }
                var blob = new Blob([BOM + csv], {type: 'text/csv;charset=utf-8;'});

                on_result_callback(blob);
            });
        }

        function clear(on_result_callback) {
            chrome.storage.local.set({
                "history_datas": []
            }, function () {
                console.log(chrome.runtime.lastError);
                var ret = true;
                if (chrome.runtime.lastError) {
                    ret = false;
                }
                on_result_callback(ret);
            });
        }

        return {
            get_history_datas_with_csvblob: get_history_datas_with_csvblob,
            get_history_datas: get_history_datas,
            get_device_id: get_device_id,
            add: add,
            clear: clear,
        }
    }

    function RecognizerClient(on_result_callback) {
        this.audio_recorder_ = new AudioRecorder();
        this.storage_helper_ = StorageHelper();
        this.server_url_ = "https://extension.doreso.com/v1/aha-music/identify";
        this.user_params_ = {};
        this.on_result_callback_ = on_result_callback;
        this.record_time_ms_ = 8000;
        var self = this;

        function _post_http(audio_buffer, user_params, send_response) {
            var post_data = new FormData();
            if (user_params) {
                for (var key in user_params) {
                    post_data.append(key, user_params[key]);
                }
            }

            post_data.append('sample_bytes', audio_buffer.size);
            post_data.append('sample', audio_buffer);
            post_data.append('timestamp', new Date().getTime());

            console.log(post_data);

            $.ajax({
                type: 'POST',
                url: self.server_url_,
                data: post_data,
                timeout: 15000,
                dataType: 'json',
                processData: false,
                contentType: false,
                tryCount : 0,
                retryLimit : 3,
                retryInterval: 500,
                success: function (data) {
                    console.log(data);
                    var resp_data = {"status": 0, "msg": "OK"};
                    if (data['status'] == 0) {
                        var song = data['data'][0];
                        song["timestamp"] = new Date().getTime();
                        song["tab_url"] = user_params["tab_url"];
                        resp_data['data'] = song;
                    } else {
                        resp_data = {"status": -1, "msg": data['msg']};
                    }
                    send_response(resp_data);
                },
                error: function (error, textStatus, error_thrown) {
                    this.tryCount++;
                    if (this.tryCount <= this.retryLimit) {
                        setTimeout(() => { $.ajax(this) }, this.retryInterval || 500);
                        return;
                    }
                    var msg = "Your Network is Unavailable";
                    var resp_data = {"status": -1, "msg": msg};
                    send_response(resp_data);
                    console.log(error);
                    console.log(textStatus);
                    console.log(error_thrown);
                }
            });
        }

        function _recognize(audio_buffer) {
            chrome.identity.getProfileUserInfo(function (user_info) {
                var email = "";
                var google_id = "";
                if (user_info) {
                    email = user_info["email"];
                    google_id = user_info["id"];
                }

                var local_lan = chrome.i18n.getUILanguage();
                if (!local_lan) {
                    local_lan = navigator.language;
                }
                var manifest = chrome.runtime.getManifest();

                var rec_params = {
                    'local_lan': local_lan,
                    'browser_version': navigator.userAgent,
                    'version': manifest.version,
                    'app_id': chrome.runtime.id,
                    'email': email,
                    'google_id': google_id,
                };
                for (var key in self.user_params_) {
                    rec_params[key] = self.user_params_[key];
                }

                self.storage_helper_.get_device_id(function (device_id) {
                    rec_params['device_id'] = device_id;
                    _post_http(audio_buffer, rec_params, function (resp_data) {
                        console.log(resp_data);
                        var code = resp_data['status'];
                        var msg = resp_data['msg'];
                        var data = {};
                        if (code == 0) {
                            data = resp_data['data'];
                        }
                        _on_result(code, msg, data);
                    });
                });
            });
        }

        function _on_data_available_callback(audio_datas) {
            console.log(audio_datas);
            self.audio_recorder_.stop();

            if (audio_datas['status'] == 0) {
                console.log(audio_datas);
                _recognize(audio_datas['data']);
            } else {
                _on_result(-1, audio_datas['msg']);
            }
        }

        function _on_result(code, msg, data = {}) {
            var ret_data = {'code': code, msg: msg, 'data': data};

            if (code == 0) {
                self.storage_helper_.add(data);
            }
            self.on_result_callback_(ret_data);
        }

        this.start = function () {
            self.audio_recorder_.stop();

            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                if (tabs.length < 1) {
                    console.error("no select tab");
                    _on_result(-1, 'Please Select one Tab.');
                    return;
                }

                var current_tag = tabs[0];
                self.user_params_['tab_url'] = current_tag['url'];
                self.user_params_['tab_title'] = current_tag['title'];

                if (!current_tag['audible']) {
                    _on_result(-1, "No Sound Playing in Current Tab");
                    return;
                }

                self.audio_recorder_.start(self.record_time_ms_, _on_data_available_callback);
            });
        };

        this.start_auth = function () {
            chrome.identity.getAuthToken({'interactive': true}, function (token) {
                if (chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError.message);
                    _on_result(-1, 'chrome.runtime.lastError.message');
                } else {
                    self.user_params_['token'] = token;
                    self.start();
                }
            });
        };
    }

    function PopupView() {
        var music_info_template_str_ = $("#music_info_template").html();
        var current_result_template_str_ = $("#current_result_template").html();

        function tmpl(tmpl, o) {
            return tmpl.replace(/{{(?:"([^"]*)"|(.*?))}}/g, function (item, qparam, param) {
                return o[qparam] || o[param];
            });
        }

        function create_url() {
            $("a").each(function() {
                var url = $(this).attr('url');
                var is_set_click = $(this).attr('is_set_click');
                if (url && !is_set_click) {
                    $(this).attr('is_set_click', "true");
                    $(this).click(function() {
                        var name = $(this).attr('name');
                        chrome.tabs.create({url: url});
                    });
                }
            });
        }

        function start() {
            var margin_top = $("#result_main").css('top');
            if (parseInt(margin_top) < 60) {
                $("#result_main").animate({'top': "240px"}, 'fast');
            }
            $("#search_bar_stop").hide();
            $("#search_bar_fail").hide();
            $("#identify_btn_stop_small").hide();
            $("#current_result").hide();

            $("#search_bar_start").show();
            $("#history_result_body").css("height", "335px");

            _del_mousewheel_event();
        }

        function stop(current_result = {}) {
            _add_mousewheel_event();

            $("#search_bar_start").hide();
            if (!current_result) {
                $("#search_bar_stop").show();
                return;
            }

            if (current_result['code'] != 0) {
                $("#identify_fail_msg").html(current_result['msg']);
                $("#search_bar_fail").show();
                return;
            }

            var newDate = new Date();
            newDate.setTime(parseInt(current_result['data']['timestamp']));
            current_result['data']['timestamp'] = newDate.format("yyyy.MM.dd hh:mm:ss");
            var tmp_html = tmpl(current_result_template_str_, current_result['data']);


            $("#current_result").html(tmp_html);
            $("#current_result").fadeIn(1500);
            $("#search_bar_stop").show();
            $("#history_result_body").css("height", "235px");

            create_url();
        }

        function show_history() {
            var margin_top = $("#result_main").css('top');
            if (parseInt(margin_top) > 60) {
                $("#result_main").animate({'top': "40px"}, 'fast');
            }
            $("#identify_btn_stop_small").show();
        }

        function reload(datas) {
            if (typeof datas !== "undefined") {
                $("#history_music_info").html("");
                var tmp_html = "";
                datas.forEach(function (value, index, array) {
                    /*if (!value['timestamp'].includes(":")) {
                        var newDate = new Date();
                        newDate.setTime(parseInt(value['timestamp']));
                        value['timestamp'] = newDate.format("yyyy.MM.dd hh:mm:ss");
                    }*/
                    tmp_html = tmp_html + tmpl(music_info_template_str_, value);
                });
                $("#history_music_info").html(tmp_html);
                $("#history_music_info").slideDown("slow");

                create_url();
            }
        }

        function _add_mousewheel_event() {
            _del_mousewheel_event();
            $(window).on('mousewheel', function (event) {
                console.log("adf");
                if (event.deltaY < -10) {
                    show_history();
                    _del_mousewheel_event();
                }
            });
        }

        function _del_mousewheel_event() {
            $(window).unbind('mousewheel');
        }

        var init = function () {
            _add_mousewheel_event();
            create_url();
        };

        return {
            init: init,
            start: start,
            stop: stop,
            reload: reload,
            show_history: show_history,
        };
    }

    function RecognizerController(popup_view) {
        this.popup_view_ = popup_view;
        this.storage_helper_ = StorageHelper();
        this.recognizer_client_ = null;
        var self = this;

        function reload() {
            self.storage_helper_.get_history_datas(function (history_datas) {
                console.log(history_datas);
                console.log("reload");
                self.popup_view_.reload(history_datas);
            });
        }

        function on_result(res_datas) {
            self.popup_view_.stop(res_datas);
            setTimeout(reload, 300);
            console.log(res_datas);
        }

        function start() {
            self.recognizer_client_ = new RecognizerClient(on_result);
            self.recognizer_client_.start();
            self.popup_view_.start();
        }
        
        function export_history(filename = "doreso_export.csv") {
            self.storage_helper_.get_history_datas_with_csvblob(function (history_csvblob) {
                if (navigator.msSaveOrOpenBlob) {
                    navigator.msSaveOrOpenBlob(history_csvblob, filename);
                } else {
                    let url = URL.createObjectURL(history_csvblob);
                    let downloadLink = document.createElement('a');
                    downloadLink.href = url;
                    downloadLink.download = filename;
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                    URL.revokeObjectURL(url);
                }
            });
        }

        function clear_history() {
            self.storage_helper_.clear(function (ret) {
                reload();
            });
        }

        return {
            start: start,
            reload: reload,
            export_history: export_history,
            clear_history: clear_history
        }
    }

    function init() {
        var popup_view = PopupView();
        var recognizer_controller = RecognizerController(popup_view);

        popup_view.init();
        recognizer_controller.reload();

        $("#search_bar_stop").click(function () {
            recognizer_controller.start();
        });
        $("#identify_btn_stop_small").click(function () {
            recognizer_controller.start();
        });
        $("#identify_fail_btn").click(function () {
            recognizer_controller.start();
        });
        $("#download_btn").click(function () {
            recognizer_controller.export_history();
        });
        $("#clear_btn").click(function () {
            if(confirm('Do you want to clear history?')) {
                recognizer_controller.clear_history();
            }
        });

        //
        // recognizer_controller.init();
        //
        recognizer_controller.start();
        // popup_view.start();
    }

    $(window).load(function () {
        var date = new Date;
        var year = date.getFullYear();
        $('#copyright_year').html(year);

        setTimeout(init, 100);
    });

})();

