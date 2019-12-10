window.onload = () => {
    const button = document.querySelector('button[data-action="change"]');
    // button.innerText = '+';
    button.innerText = '1';

    // let places = staticLoadPlaces();

    // localstorage
    // var saveStorage = function(key,val){
	// 	localStorage.setItem(key, JSON.stringify(val));
	// };

	// var getStorage = function(key){
	// 	var obj = localStorage.getItem(key);
	// 	return JSON.parse(obj);
	// };

	// var add = function(){
	// 	var title = $(".memoForm #title").val();

    // if( navigator.geolocation )
    // {
    //     navigator.geolocation.getCurrentPosition(
    //         function( position )
    //         {
    //             var data = position.coords ;
    //             ttl = data.latitude ;
    //             bdy = data.longitude ;
    //             addMemo(title, ttl,bdy);
	// 	        saveMemo(title, ttl,bdy);
    //         },
    
    //         function( error )
    //         {
    //             var errorInfo = [
    //                 "原因不明のエラーが発生しました…。" ,
    //                 "位置情報の取得が許可されませんでした…。" ,
    //                 "電波状況などで位置情報が取得できませんでした…。" ,
    //                 "位置情報の取得に時間がかかり過ぎてタイムアウトしました…。"
    //             ] ;
    
    //             var errorNo = error.code ;
    //             var errorMessage = "[エラー番号: " + errorNo + "]\n" + errorInfo[ errorNo ] ;
            
    //             alert( errorMessage ) ;
    //         } ,

    //         {
    //             "enableHighAccuracy": false,
    //             "timeout": 8000,
    //             "maximumAge": 30000,
    //         }
    //     ) ;
    // }

    // else
    // {
    //     var errorMessage = "お使いの端末は、GeoLacation APIに対応していません。" ;
    //     alert( errorMessage ) ;
    // }
	// }; // add



	// var addMemo = function(title, ttl,bdy){
    //     var template =
    //                 '<p type="text" id="title" class="form-control" readonly="readonly">%s : %s : %s</p>';
    //                 template = template.replace('%s',title).replace('%s',ttl).replace('%s',bdy);

    //     // ストレージエリアに要素を追加
	// 	$("#memoArea").append(template);

    //     // 入力欄を初期化
	// 	$(".memoForm #title").val('');
	// }

	// memoArr = [];
    // var storageKey = 'memoObj';
    
	// var saveMemo = function(title, ttl, bdy){

	// 	var memoObj = {
    //         title : title, 
	// 		ttl : ttl,
	// 		bdy : bdy
	// 	};
    //     memoArr.push(memoObj);
    //     saveStorage(storageKey,memoArr);
	// }

    
	// var resetMemo = function(){
	// 	$("#memoArea").children().remove();
	// 	window.localStorage.clear();
	// }

	// var readMemo = function(){
	// 	var memoObjs = getStorage(storageKey);
	// 	if (memoObjs == null) {
    //         return;
    //     } else {
	// 	for (var i = 0; i < memoObjs.length; i ++) {
	// 		var memoObj = memoObjs[i];
	// 		var ttl = memoObj.ttl;
    //         var bdy = memoObj.bdy;
    //         var title = memoObj.title;
	// 		var memoObj = {
    //             title : title, 
	// 			ttl : ttl,
	// 			bdy : bdy
    //         };
    //     // このmemoArrが必要なデータになる
	// 	memoArr.push(memoObj);
	// 	saveStorage(storageKey,memoArr);
	// 	addMemo(title,ttl,bdy);
    //     }
    //     }
	// };

	// // ページ読込み時にメモ復帰
	// readMemo();

	// //イベントハンドル
	// $("#btnAdd").on('click',function(){
    //     add();
	// });
	// $("#btnReset").on('click',function(){
	// 	resetMemo();
    // });
    

    let places = [
        // 西輝野あたり
        {
            name: 'TestOne',
            location: {
                lat: 35.393626,
                lng: 139.470360,
            },
        }, 
        // トヨペット前の道路
        {
            name: 'TestTwo',
            location: {
                lat: 35.393923,
                lng: 139.470519,
            },
        },
    ];

    // let places = memoArr;

    // 指定した場所にモデルを描画する
    renderPlaces(places);
};

function staticLoadPlaces() {
    return [
        // 西輝野あたり
        {
            name: 'TestOne',
            location: {
                lat: 35.393626,
                lng: 139.470360,
            },
        }, 
        // トヨペット前の道路
        {
            name: 'TestTwo',
            location: {
                lat: 35.393923,
                lng: 139.470519,
            },
        },
    ];
}

// モデルデータの格納．とりあえずこれは1つでいい
var models = [
    {
        url: './assets/lowpoly_pin/scene.gltf',
        scale: '1 1 1',
        rotation: '0 180 0',
        info: 'Pins',
    }
];



var modelIndex = 0;
// モデル自体のパスと色々なオプションの追加
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

    // テキストの表示
    // const div = document.querySelector('.instructions');
    // div.innerText = model.info;
};


function renderPlaces(places) {
    let scene = document.querySelector('a-scene');

    // 位置データのそれぞれに適用．2個あったら2ループする．
    places.forEach((place) => {

        let latitude = place.location.lat;
        let longitude = place.location.lng;
        // let title = place.name;
        // モデル用の空entityタグを生成
        let model = document.createElement('a-entity');
        // タグに緯度と経度を追加
        model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
        // model.setAttribute('name', `${title}`);

        // ここのmodel引数はentityタグ．entityにmodelsから取り出したモデルの情報を追加．
        setModel(models[modelIndex], model);

        // これはいらないかな
        // model.setAttribute('animation-mixer', '');

        // // // クリックイベント
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
                // const label = document.createElement('span');
                // const container = document.createElement('div');
                const label = document.querySelector('.instructions');
                
                // container.setAttribute('id', 'place-label');
                label.innerText = name;
                // container.appendChild(label);
                // document.body.appendChild(container);

                // setTimeout(() => {
                //     container.parentElement.removeChild(container);
                // }, 1500);
            }
        };

        model.addEventListener('click', clickListener);

        scene.appendChild(model);
    });
}