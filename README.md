Node.jsをインストールしたら下記のコマンドを実行

npm install

npm install -g serve

その後src直下にfirebaseフォルダを作成してfirebaseConfig.jsファイルを作成 ファイルの中身は後日教えます

u22/src/firebase/firebaseConfig.js <-こんな感じ


### ビルド
npm run build

### ローカルホスト
serve もしくは firebase serve

### 禁止事項
firebase deploy コマンドの実行

上記に書いていないnpmパッケージのインストール

src, public配下以外のファイルの編集
