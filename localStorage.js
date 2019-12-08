$(document).ready(function(){

	var saveStorage = function(key,val){
		localStorage.setItem(key, JSON.stringify(val));
	};

	var getStorage = function(key){
		var obj = localStorage.getItem(key);
		return JSON.parse(obj);
	};

	var add = function(){
        // タイトルと本文の入力を取得
        // この入力情報を現在地に変更すればOK
		// var ttl = $(".memoForm #title").val();
        // var bdy = $(".memoForm #body").val();


        // geolocation
// ユーザーの端末がGeoLocation APIに対応しているかの判定


    // 対応している場合
    if( navigator.geolocation )
    {
        // 現在地を取得
        navigator.geolocation.getCurrentPosition(
    
            // [第1引数] 取得に成功した場合の関数
            function( position )
            {
                // 取得したデータの整理
                var data = position.coords ;
    
                // データの整理
                ttl = data.latitude ;
                bdy = data.longitude ;
                var alt = data.altitude ;
                var accLatlng = data.accuracy ;
                var accAlt = data.altitudeAccuracy ;
                var heading = data.heading ;
                var speed = data.speed ;
    
                // HTMLへの書き出し
                // document.getElementById( 'result' ).innerHTML = '<dl><dt>緯度</dt><dd>' + lat + '</dd><dt>経度</dt><dd>' + lng + '</dd><dt>緯度、経度の精度</dt><dd>' + accLatlng;
                // return (lat, lng);

                addMemo(ttl,bdy);
		        saveMemo(ttl,bdy);
    
            },
    
            // [第2引数] 取得に失敗した場合の関数
            function( error )
            {
                // エラーコード(error.code)の番号
                // 0:UNKNOWN_ERROR				原因不明のエラー
                // 1:PERMISSION_DENIED			利用者が位置情報の取得を許可しなかった
                // 2:POSITION_UNAVAILABLE		電波状況などで位置情報が取得できなかった
                // 3:TIMEOUT					位置情報の取得に時間がかかり過ぎた…
    
                // エラー番号に対応したメッセージ
                var errorInfo = [
                    "原因不明のエラーが発生しました…。" ,
                    "位置情報の取得が許可されませんでした…。" ,
                    "電波状況などで位置情報が取得できませんでした…。" ,
                    "位置情報の取得に時間がかかり過ぎてタイムアウトしました…。"
                ] ;
    
                // エラー番号
                var errorNo = error.code ;
    
                // エラーメッセージ
                var errorMessage = "[エラー番号: " + errorNo + "]\n" + errorInfo[ errorNo ] ;
                
                // return errorMessage;
    
                // アラート表示
                alert( errorMessage ) ;
    
                // HTMLに書き出し
                // document.getElementById("result").innerHTML = errorMessage;
            } ,
    
            // [第3引数] オプション
            {
                "enableHighAccuracy": false,
                "timeout": 8000,
                "maximumAge": 30000,
            }
    
        ) ;
    }
    
    // 対応していない場合
    else
    {
        // エラーメッセージ
        var errorMessage = "お使いの端末は、GeoLacation APIに対応していません。" ;
    
        // アラート表示
        alert( errorMessage ) ;
    
        // HTMLに書き出し
        // document.getElementById( 'result' ).innerHTML = errorMessage ;
        
        
    }

        
	};

	var addMemo = function(ttl,bdy){
		// var template =
        //             '<input type="text" id="title" class="form-control" readonly="readonly" value="%s"/>' +
        //   '<textarea class="form-control" rows="3" id="body" readonly="readonly">%s</textarea>';
        var template =
                    '<p type="text" id="title" class="form-control" readonly="readonly">%s : %s</p>';
                    template = template.replace('%s',ttl).replace('%s',bdy);

        // ストレージエリアに要素を追加
		$("#memoArea").append(template);

        // 入力欄を初期化
		$(".memoForm #title").val('');
		$(".memoForm #body").val('');
	}

	memoArr = [];
	var storageKey = 'memoObj';

	var saveMemo = function(ttl,bdy){
		var memoObj = {
			ttl : ttl,
			bdy : bdy
		};
		memoArr.push(memoObj);
		saveStorage(storageKey,memoArr);
	}

	var resetMemo = function(){
		$("#memoArea").children().remove();
		window.localStorage.clear();
	}

	var readMemo = function(){
		var memoObjs = getStorage(storageKey);
		if (memoObjs == null) {
            return;
        } else {
            for (var i = 0; i < memoObjs.length; i ++) {
                var memoObj = memoObjs[i];
                var ttl = memoObj.ttl;
                var bdy = memoObj.bdy;
                var memoObj = {
                    ttl : ttl,
                    bdy : bdy
            };
        }
		
		memoArr.push(memoObj);
		saveStorage(storageKey,memoArr);
			addMemo(ttl,bdy);
		}
	};

	// ページ読込み時にメモ復帰
	readMemo();

	//イベントハンドル
	$("#btnAdd").on('click',function(){
        // ここの内容，つまりadd関数の中身を，取得した現在地を格納するものに変更する
        add();
	});
	$("#btnReset").on('click',function(){
		resetMemo();
	});

});







