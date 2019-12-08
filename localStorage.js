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
		var ttl = $(".memoForm #title").val();
		var bdy = $(".memoForm #body").val();
		addMemo(ttl,bdy);
		saveMemo(ttl,bdy);
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



// 


