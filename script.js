window.onload = () => {
    const button = document.getElementById("add-button");
    // button.innerText = '+';
    button.innerText = '14';

    // let places = staticLoadPlaces();

    // localstorage
    var saveStorage = function(key,val){
		localStorage.setItem(key, JSON.stringify(val));
	};

	var getStorage = function(key){
		var obj = localStorage.getItem(key);
		return JSON.parse(obj);
	};

	var add = function(){
        // var title = $(".input-area #title").val();
        var title = document.getElementById("title").value;

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
                    var errorMessage = "[error : " + errorNo + "]\n" + errorInfo[ errorNo ] ;
                
                    alert( errorMessage ) ;
                } ,

                {
                    // ここtrueにしておく
                    "enableHighAccuracy": false,
                    "timeout": 8000,
                    "maximumAge": 30000,
                }
            ) ;
        }
        else
        {
            var errorMessage = "Don't Compatible with GeoLocation API" ;
            alert( errorMessage ) ;
        }
	}; // add

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

	dataArr = [
        {
            title : "test", 
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
		// $("#data-area").children().remove();
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

	// ページ読込み時にメモ復帰
	readData();


	$("#add-button").on('click',function(){
        add();
        renderPlaces(dataArr);
    });


// $(document).on("click", "#add-button", function() {
//   // clickイベントの処理
//   add();
//         renderPlaces(dataArr);
// });
    
	$("#reset-button").on('click',function(){
        resetData();
        dataArr = [];
        renderPlaces(dataArr);
    });
    

    // let places = [
    //     // 西輝野あたり
    //     {
    //         name: 'TestOne',
    //         // location: {
    //         lat: 35.393626,
    //         lng: 139.470360,
    //         // },
    //     }, 
    //     // トヨペット前の道路
    //     {
    //         name: 'TestTwo',
    //         // location: {
    //         lat: 35.393923,
    //         lng: 139.470519,
    //         // },
    //     },
    // ];

    // 指定した場所にモデルを描画する
    // renderPlaces(places);
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

        // ここのmodel引数はentityタグ．entityにmodelsから取り出したモデルの情報を追加．
        setModel(models[modelIndex], model);


        // // ボタンのクリックイベント
        // document.querySelector('button[data-action="change"]').addEventListener('click', function (ev, taeget) {

        //     const intersectedElement = ev && ev.detail && ev.detail.intersectedEl;
        //         if (aEntity && intersectedElement === aEntity) {
        //             const div = document.querySelector('.instructions');
        //             div.innerText = model.info;
        //         }
        //     // すでにあるコンポーネントを指定している
        //     var entity = document.querySelector('[gps-entity-place]');
        //     modelIndex++;
        //     var newIndex = modelIndex % models.length;
        //     setModel(models[newIndex], entity);
        // });

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

testcount = 0;
testcountarea = document.getElementById("testcount");
testcountarea.innerHTML = testcount;


$(document).on("click", "#plus", function() {
    testcount++;
    testcountarea.innerText = testcount;
    console.log("plus");
});