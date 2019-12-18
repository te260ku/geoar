window.onload = () => {
    const addButton = document.getElementById("add-button");
    addButton.innerText = '1';
    const resetButton = document.getElementById("reset-button");
    resetButton.innerText = '-';

    // localstorageを使うための関数を定義
    var saveStorage = function(key,val){
		localStorage.setItem(key, JSON.stringify(val));
	};

	var getStorage = function(key){
		var obj = localStorage.getItem(key);
		return JSON.parse(obj);
	};

	var add = function(){
        var title = document.getElementById("title").value;
        var label = document.querySelector('.instructions');

        if( navigator.geolocation )
        {
            navigator.geolocation.getCurrentPosition(

                function( position )
                {
                    var location = position.coords ;
                    lat = location.latitude ;
                    lng = location.longitude ;
                    addData(title,lat,lng);
                    saveData(title,lat,lng);
                },
                function( error )
                {
                    var errorInfo = [
                        "unexpected error" ,
                        "prihibited" ,
                        "signal blocked" ,
                        "timeout"
                    ] ;
                    var errorNo = error.code ;
                    var errorMessage = "[error : " + errorNo + "]\n" + errorInfo[ errorNo ];
                    
                    label.innerText = errorMessage;
                } ,
                {
                    // ここtrueにすると精度が上がる
                    "enableHighAccuracy": false,
                    "timeout": 8000,
                    "maximumAge": 30000,
                }
            ) ;
        }
        else
        {
            var errorMessage = "Don't Compatible with GeoLocation API" ;
            label.innerText = errorMessage;
        }
	}; 

    countArea = document.getElementById("count-area");
    count = 0;
    countArea.innerText = count;

    
	var addData = function(){
        // count ++;
        countArea.innerText = dataArr.length;
        // 入力欄を初期化
        document.getElementById("title").value = "";
	}

    // タイトルと位置情報のデータ
	dataArr = [
        {
            title : "sfc", 
            lat : 35.393626,
            lng : 139.470360
        }
    ];
    
    var storageKey = 'dataObj';
    
	var saveData = function(title,lat,lng){
		var dataObj = {
            title : title, 
			lat : lat,
			lng : lng
		};
        dataArr.push(dataObj);
        saveStorage(storageKey,dataArr);
	}

	var resetData = function(){
        window.localStorage.clear();
        dataArr = [];
        count = 0;
        countArea.innerText = dataArr.length;
	}

	var readData = function(){
		var dataObjs = getStorage(storageKey);
		if (dataObjs.length == 0) {
            return;
        } else {
		for (var i = 0; i < dataObjs.length; i ++) {
			var dataObj = dataObjs[i];
			var lat = dataObj.lat;
            var lng = dataObj.lng;
            var title = dataObj.title;
			var dataObj = {
                title : title, 
				lat : lat,
				lng : lng
            };
		dataArr.push(dataObj);
		saveStorage(storageKey,dataArr);
		addData(title,lat,lng);
        }
        }
	};

	// 読込み時にデータ復帰
	readData();

	$("#add-button").on('click',function(){
        add();
        renderPlaces(dataArr);
    });
    
	$("#reset-button").on('click',function(){
        resetData();
        renderPlaces(dataArr);
    });
    
    // 指定した場所にモデルを描画する
    renderPlaces(dataArr);
};


// 使用するモデルの設定
var models = [
    {
        url: './assets/lowpoly_pin/scene.gltf',
        scale: '2 2 2',
        rotation: '0 180 0',
        info: 'Pins',
    }
];

var modelIndex = 0;

var setModel = function (model, entity) {
    if (model.scale) {
        entity.setAttribute('scale', model.scale);
    }

    if (model.rotation) {
        entity.setAttribute('rotation', model.rotation);
    }

    if (model.position) {
        entity.setAttribute('position', model.position);
    }

    entity.setAttribute('gltf-model', model.url);
};


function renderPlaces(places) {
    let scene = document.querySelector('a-scene');

    places.forEach((place) => {

        let latitude = place.lat;
        let longitude = place.lng;
        let title = place.title;
        // モデル用の空entityタグを生成
        let model = document.createElement('a-entity');
        // タグに緯度と経度を追加
        model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
        model.setAttribute('name', `${title}`);

        
        setModel(models[modelIndex], model);

        // オブジェクトに対するクリックイベント
        const clickListener = function (ev) {
            ev.stopPropagation();
            ev.preventDefault();

            let name = ev.target.getAttribute('name');

            const el = ev.detail.intersection && ev.detail.intersection.object.el;

            if (el && el === ev.target) {
                const label = document.querySelector('.instructions');
                label.innerText = name;
            }
        };
        model.addEventListener('click', clickListener);
        scene.appendChild(model);
    });
}