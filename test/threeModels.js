window.onload = () => {
    const button = document.querySelector('button[data-action="change"]');
    button.innerText = '﹖';

    // placesにあらかじめ設定した名前と緯度経度のデータを入れる
    let places = staticLoadPlaces();

    // 指定した場所にモデルを描画する
    renderPlaces(places);
};

function staticLoadPlaces() {
    return [
        // 西輝野
        {
            name: 'Pokemon',
            location: {
                lat: 35.393626,
                lng: 139.470360,
            },
        }, 
        // トヨペット前の道路
        {
            name: 'Pokemon',
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
        url: './assets/magnemite/scene.gltf',
        scale: '1 1 1',
        info: 'Magnemite, Lv. 5, HP 10/10',
        rotation: '0 180 0',
    },
    {
        url: './assets/articuno/scene.gltf',
        scale: '0.2 0.2 0.2',
        rotation: '0 180 0',
        info: 'Articuno, Lv. 80, HP 100/100',
    },
    {
        url: './assets/dragonite/scene.gltf',
        scale: '0.08 0.08 0.08',
        rotation: '0 180 0',
        info: 'Dragonite, Lv. 99, HP 150/150',
    },
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
    const div = document.querySelector('.instructions');
    div.innerText = model.info;
};


function renderPlaces(places) {
    let scene = document.querySelector('a-scene');

    // 位置データのそれぞれに適用．2個あったら2ループする．
    places.forEach((place) => {

        let latitude = place.location.lat;
        let longitude = place.location.lng;
        // モデル用の空entityタグを生成
        let model = document.createElement('a-entity');
        // タグに緯度と経度を追加
        model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);

        // ここのmodel引数はentityタグ．entityにmodelsから取り出したモデルの情報を追加．
        setModel(models[modelIndex], model);

        // これはいらないかな
        model.setAttribute('animation-mixer', '');

        // クリックイベント
        document.querySelector('button[data-action="change"]').addEventListener('click', function () {
            // すでにあるコンポーネントを指定している
            var entity = document.querySelector('[gps-entity-place]');
            modelIndex++;
            var newIndex = modelIndex % models.length;
            setModel(models[newIndex], entity);
        });

        scene.appendChild(model);
    });
}