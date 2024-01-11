P.preload = async function() {
    this.loadSound('../assets/Boing.wav','Boing');
    this.loadSound('../assets/Cat.wav','Cat');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadSound('../assets/Bossa Nova.wav','BossaNova')
    this.loadImage('../assets/cat.svg','Cat1');
    this.loadImage('../assets/cat2.svg','Cat2');
    this.loadImage('../assets/Jurassic.svg','Jurassic');
}

// 引数で renderを渡さなくても P.render で参照可能
// MyStage 引数で render 省略したほうが見やすい
// MyCat 引数で stage 省略したほうが見やすい
P.setup = async function(render) {

    P.wait_time = P.Env.pace;

    P.stage = new MyStage( render, "stage" );
    P.stage.addImage( P.images.Jurassic );
    P.spriteA = new MyCat( P.stage, "spriteA", {'effect': {'color': 100}});
    P.spriteA.addImage( P.images.Cat1 );
    P.spriteA.addImage( P.images.Cat2 );
    P.spriteA.position = { x:0, y:0 };
    P.spriteA.scale = { x:150, y:150 };
    P.spriteA.direction = Math.random() * 360;

}
P.staging = async function( render ) {

    P.stage.whenFlag(async function(){
        // TODO addSound 処理時間が長いとき、登録順が逆になるときがある。なんとかしたい。
        this.addSound( P.sounds.Chill, { 'volume' : 125 } );
        this.addSound( P.sounds.BossaNova , { 'volume' : 25 } );  
        //P.start2(render);
    });
    P.stage.whenFlag( async function() {
        for(;;){
            await this.startSoundUntilDone();
            await P.Utils.wait( P.wait_time );
        }
    });
    P.stage.whenFlag( async function() {
        await P.Utils.wait(500);
        const _sprites = this.sprites;
        let pitch = 1;
        let picthPower = 0.01;
        for(;;) {
            pitch += picthPower;
            if ( pitch > 3 || pitch < 0.5 ) picthPower *= -1;
            P.spriteB.setSoundPitch( pitch );
            P.spriteC.setSoundPitch( pitch );
            P.spriteB.setSoundPitch(pitch);
            P.spriteC.setSoundPitch(pitch);
            await P.Utils.wait( P.wait_time );
        }
    });
    P.stage.whenClicked( async function() {
        // 横向きに反転させる
        const scale = this.scale;
        this.setScale( scale.x * -1, scale.y );
        this.nextSound();
    });

//    const render = new P.Render();
    P.spriteA.whenFlag(async function(){
        this.addSound( P.sounds.Boing , { 'volume' : 25 } ); 
        this.addSound( P.sounds.Cat , { 'volume' : 25 } ); 
        const MoveStepsA = 2;
        const s = P.spriteA;
        for(;;){
            s.isTouchingEdge(function(){
                const optionsX = {
                    'position':{
                        x: (Math.random() - 0.5) * 300, 
                        y: (Math.random() - 0.5) * 200
                    }, 
                    'scale':{x:100, y:100}, 
                    effect:{'color' : 50}
                };
                s.clone(optionsX).then(async (v)=>{
                    P.stage.update();
                    P.stage.draw();
                    //console.log('SpriteA クローンを作った')
                    const x = v;
                    x.life = 50;
                    setTimeout(async function(){
                        for(;;) {
                            x.moveSteps(2);
                            x.ifOnEdgeBounds();
                            x.nextCostume();
                            x.scale.x -= 0.5;
                            x.scale.y -= 0.5;    
                            await P.Utils.wait(P.pace);
                        }                        
                    })
                }); 
            });
            s.moveSteps(MoveStepsA);
            s.ifOnEdgeBounds();
            s.nextCostume();
            await P.Utils.wait(P.pace);
        }
    });
    const optionsB = {'position': { x: P.spriteA.position.x+50, y: P.spriteA.position.y }}    
    P.spriteA.clone(optionsB).then(async (v)=>{
        P.spriteB = v;
        //v.addSound( P.sounds.Boing , { 'volume' : 25 } ); 
        //v.addSound( P.sounds.Cat , { 'volume' : 25 } ); 
        v.clearEffect();
        v.scale = { x:100, y:100 };
        v.direction = Math.random() * 360;
        v.whenClicked( async function() {
            const scale = v.scale;
            v.setScale( scale.x * -1, scale.y );
        });
        const s = v;
        const _moveSteps = 5;
        setTimeout(async function(){
            for(;;){
                s.moveSteps(_moveSteps);
                s.ifOnEdgeBounds();
                s.nextCostume();
                await P.Utils.wait(P.pace);
            }
        },0 );
    });
    P.spriteA.clone().then(v=>{
        P.spriteC = v;
        //v.addSound( P.sounds.Boing , { 'volume' : 25 } ); 
        //v.addSound( P.sounds.Cat , { 'volume' : 25 } ); 
    
        v.position = {x: P.spriteA.position.x-200, y: P.spriteA.position.y+20 };
        v.scale = {x:50, y:50};
        v.direction = Math.random() * 360;
        v.clearEffect();
        v.whenClicked( async function() {
            const scale = v.scale;
            v.setScale( scale.x * -1, scale.y );
        });
        P.stage.update();
        P.stage.draw();
        const MoveSteps = 20;
        setTimeout(async function() {
            for(;;) {
                v.moveSteps(MoveSteps);
                v.ifOnEdgeBounds();
                v.nextCostume();
                await P.Utils.wait(P.pace);
            }    
        });
    });

    P.spriteA.whenClicked( async function() {
        if( P.MoveStepsA == 3 ) {
            P.MoveStepsA = 0;
        }else{
            P.MoveStepsA = 3;
        }
    });
}

P.draw = function() {
    P.stage.update();
    P.stage.draw();
}