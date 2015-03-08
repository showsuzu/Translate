# Translate
#### Apache Cordovaを使用して、マイク入力、翻訳、音声合成の各処理を行うアプリ

Nexus5(5.0.1)で動作確認しました。

個別にプラグインが必要です。

コマンドラインから以下のようにインストールできます。

```bssh
cordova plugin add https://github.com/poiuytrez/SpeechRecognizer
cordova plugin add org.apache.cordova.device
cordova plugin add org.apache.cordova.media
cordova plugin add org.apache.cordova.speech.speechsynthesis
```


音声合成処理終了後に、短い終了音を鳴らす処理を行っています。

著作権の都合で音声データはアップしていないので、準備して変数（whistleData）にファイル名を設定する必要があります。


大まかな仕様
 * 第一言語を第二言語に翻訳する仕様
 * 第一言語は日本語固定
 * 第二言語はリストから選択する仕様
 * 発音が終わったら、音を再生する仕様



音声入力
 * com.phonegap.plugins.speech を使用します



翻訳機能について
 * MyMemory（https://mymemory.translated.net/）のAPIを使用します
 * 上記のAPIには使用制限があります
  - 1日のAPIコールは100回まで
  - この制限は、APIコール時に連絡先を明記することで、1000回まで拡張可能
  - 一つのセンテンスに、500キャラ以上含まれると、NGになります（使用制限ではなく仕様です）
 * 詳細は、このURLを参照にしています＜http://melborne.github.io/2014/02/25/togglate-meets-mymemory/＞


音声合成について
 * speech synthesis機能を使用します
 * Cordova Pluginで、org.apache.cordova.speech.speechsynthesis を使用します

