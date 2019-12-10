window.onload = () => {
    const button = document.querySelector('button[data-action="change"]');
    button.innerText = '+';

    // placesにあらかじめ設定した名前と緯度経度のデータを入れる
    // let places = staticLoadPlaces();

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
        scale: '0.2 0.2 0.2',
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

            var name = ev.target.getAttribute('name');

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