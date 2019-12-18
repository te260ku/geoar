window.onload = () => {
    const addButton = document.getElementById("add-button");
    addButton.innerText = '+';
    const resetButton = document.getElementById("reset-button");
    resetButton.innerText = '-';
    // button.innerText = '17';

    // let places = staticLoadPlaces();

    // localstorageを使うための関数を定義
    var saveStorage = function(key,val){
		localStorage.setItem(key, JSON.stringify(val));
	};

	var getStorage = function(key){
		var obj = localStorage.getItem(key);
		return JSON.parse(obj);
	};

	var add = function(){
        // var title = $("#title").val();
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
                    // ここtrueにすると精度が上がるらしい
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

    
	var addData = function(title,lat,lng){
        var template = '<p type="text" id="title" class="form-control" readonly="readonly">%s : %s : %s</p>';
        template = template.replace('%s',title).replace('%s',lat).replace('%s',lng);

        count ++;
        countArea.innerText = count;
        // 入力欄を初期化
        // $(".input-area #title").val('');
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
        count = 0;
        countArea.innerText = count;
	}

	var readData = function(){
		var dataObjs = getStorage(storageKey);
		if (dataObjs == null) {
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
        // このdataArrが必要なデータになる
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
        dataArr = [];
        renderPlaces(dataArr);
    });
    
    // 指定した場所にモデルを描画する
    renderPlaces(dataArr);
};

// function staticLoadPlaces() {
//     return [
//         // 西輝野あたり
//         {
//             name: 'TestOne',
//             location: {
//                 lat: 35.393626,
//                 lng: 139.470360,
//             },
//         }, 
//         // トヨペット前の道路
//         {
//             name: 'TestTwo',
//             location: {
//                 lat: 35.393923,
//                 lng: 139.470519,
//             },
//         },
//     ];
// }

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

// testcount = 0;
// testcountarea = document.getElementById("testcount");
// testcountarea.innerHTML = testcount;


// $(document).on("click", "#plus", function() {
//     testcount++;
//     testcountarea.innerText = testcount;
//     console.log("plus");
// });