//Global variable
//  for Recognition
var nowRecognition = false;

//Global defined valeu
//  for voice recognition(Speech to Text)
var language1 = 'ja';
var language2 = 'en';
//  for translator
var translaionURI = "http://mymemory.translated.net/api/get?q=";
var langQS = "&langpair=";

//TODO
var whistleData = '';
//
//Speech to Text(voice recognize)
//
function start () {
    var maxMatches = 1;
    var promptString = '音声入力中 / Speak now'; // optional
    plugins.speechrecognizer.startRecognize(function(result){
        //change Button display
        btn1_disp('stop');
        ////when div field
        //document.mic_input1.input_field.value = result;
        set_recognizedResult(result);
        //
        console.log("Result : " + result);
    }, function(errorMessage){
        //change Button display
        btn1_disp('stop');
        console.log("Error message: " + errorMessage);
    }, maxMatches, promptString, language1);

    nowRecognition = true;
};

function stop () {
//    recognition.stop();
    nowRecognition = false;
}

//
//Get and Set
//
function get_recognizedResult() {
    //var text = document.mic_input1.input_field.value;
    //console.log("To transrate text : " + text);
    return document.mic_input1.input_field.value;
}

function set_recognizedResult(recognizedText) {
    document.mic_input1.input_field.value = recognizedText;
}

function set_translatedResult(translatedText) {
    document.translate.translate_result.value = translatedText;
}

function get_translatedResult() {
    return document.translate.translate_result.value;
}

function get_translateLang() {
    return {
        'from':language1,
        'to':language2
    }
}
//
//Translation
//
function translate(mode) {
    // from and to is ISO language code by RFC3066.
    // please refer to following URL
    //   http://www.marbacka.net/msearch/sprakkod.html
    var lang = get_translateLang();
    var from = lang.from;
    var to = lang.to;
    var text = document.mic_input1.input_field.value;
    var langpair = langQS + from + '|' + to;
    var fullURI = translaionURI + text + langpair;

    console.log("translate langpair : " + langpair);
    console.log("translate text : " + text);

    $.ajax({
        url: fullURI, dataType: 'json', success: function (data) {
            var translatedText = data.responseData.translatedText;
            console.log("Result : " + translatedText)
            trans_disp("stop");
            set_translatedResult(translatedText);
        }
    });
}

//
//Text To Speech
//
function do_tts(text, lang, mode) {
    // Refer to http://qiita.com/ikr7/items/71406123c991a05ed8ba
    // and http://qiita.com/kyota/items/da530ad22733b644518a
    var speech = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();

    // 以下オプション設定
    speech.voice = language2; // 0:en-US
    speech.volume = 1.0; // 音量 min 0 ~ max 1
    speech.rate = 1.0; // 速度 min 0 ~ max 10
    speech.pitch = 1.0; // 音程 min 0 ~ max 2

    speech.text = text;
    speech.lang = lang;

    // 発話実行
    speechSynthesis.speak(speech);

    // 終了時の処理
    speech.onend = function (event) {
        spk_disp("stop");
        playAudio(whistleData);
    }
}

//
//for Button display
//
function btn1_disp(stat) {
    var btn_val = document.getElementById('btn1');
    if(stat == 'stop') {
        //stat == stop : start recog
        btn_val.value = '音声入力開始';
        btn_val.className = '';
    } else {
        //stat == start : stop regcog
        btn_val.value = '音声入力停止';
        btn_val.className = 'select';
    }
}

function trans_disp(stat) {
    var btn_val = document.getElementById('trans');
    if(stat == 'stop') {
        //stat == stop : start recog
        btn_val.value = '翻訳開始';
        btn_val.className = '';
    } else {
        //stat == start : stop regcog
        btn_val.value = '翻訳中';
        btn_val.className = 'select';
    }
}

function spk_disp(stat) {
    var btn_val = document.getElementById('spk');
    if(stat == 'stop') {
        //stat == stop
        btn_val.value = '再生開始';
        btn_val.className = '';
    } else {
        //stat == start
        btn_val.value = '再生中';
        btn_val.className = 'select';
    }
}

//
//Functional definition to the Button
//
document.querySelector('#btn1').onclick = function () {
    if (nowRecognition) {
        stop();
        this.value = '音声入力開始';
        this.className = '';
    } else {
        start();
        this.value = '音声入力停止';
        this.className = 'select';
    }
}

document.querySelector('#trans').onclick = function () {
    console.log("TAP button go to translate");
    trans_disp("start");
    translate('single');
}

document.querySelector('#spk').onclick = function () {
    console.log("TAP button go to speak");
    spk_disp("start");

    var text = get_translatedResult(); // 喋る内容
    var lang = language2;
    do_tts(text, lang);
}

document.querySelector('#select1').onchange = function() {
    console.log("Changed langage");
    language2 = this.value;
}

//
//Play Audio file
//  refer to : http://docs.phonegap.com/en/edge/cordova_media_media.md.html
//  useage : playAudio(whistleData);
//
var my_media = null;

//絶対パスの取得
function getPath(){
    var str = location.pathname;
    var i = str.lastIndexOf('/');
    return str.substring(0,i+1);
}

function playAudio(src) {
    if (my_media == null) {
        var path = getPath()+src;
        // Create Media object from src
        my_media = new Media(path, onSuccess, onError, onStatus);
    } // else play current audio
    // Play audio
    my_media.play();
}

// Pause audio
//
function pauseAudio() {
    if (my_media) {
        my_media.pause();
    }
}

// Stop audio
//
function stopAudio() {
    if (my_media) {
        my_media.stop();
    }
}

// onSuccess Callback
//
function onSuccess() {
    console.log("playAudio():Audio Success");
}

// onError Callback
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

// Status Changed Callback
//  status parameta
//    Media.MEDIA_NONE     = 0;
//    Media.MEDIA_STARTING = 1;
//    Media.MEDIA_RUNNING  = 2;
//    Media.MEDIA_PAUSED   = 3;
//    Media.MEDIA_STOPPED  = 4;
//
function onStatus(status){
    if(status==4){  //already stop status
        my_media.release();
        my_media = null;
    }
}

