/**
 * Sample09
 * スプライトのクローンを作る（スプライトをクリックしたらクローンを作る）
 * クローンされたら動きだす（端に触れたらミャーとないて折り返す）
 */
P.preload = async function() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cat.svg','Cat');
    this.loadSound('../assets/Cat.wav','Mya');
}

P.prepare = async function() {
    P.stage = new P.Stage("stage");
    P.stage.addImage( P.images.Jurassic );
    P.cat = new P.Sprite("Cat");
    P.cat.addImage( P.images.Cat );
}

P.setting = async function() {

    P.stage.whenFlag(async function() {
        this.addSound( P.sounds.Chill, { 'volume' : 50 } );
    });
    P.stage.whenFlag(async function() {
        this.startThread( async function() {
            for(;;) {
                await this.startSoundUntilDone();
                await P.Utils.wait(P.Env.pace);
            }
        });
    });
    P.cat.whenFlag( async function() {
        // 音を登録する
        this.addSound( P.sounds.Mya, { 'volume' : 20 } );
    });
    P.cat.whenFlag( async function() {
        // 向きをランダムに変える。
        const me = this;
        const direction = 1;
        // ずっと繰り返す、スレッドを起動する
        me.startThread( async function() {
            for(;;) {
                me.direction += direction;
                await P.Utils.wait(P.Env.pace);
            }
        });
    });

    const steps = 10;
    P.cat.whenClicked( async function() {

        P.spriteClone( this, async function() {
            const me = this;
            me.scale.x = 50;
            me.scale.y = 50;
            me.effect.color = 50;
            // ずっと繰り返す、スレッドを起動する
            me.startThread( async function() {
                for(;;) {
                    me.moveSteps( steps );
                    // 端に触れたら
                    this.isTouchingEdge(function(){
                        // ミャーと鳴く。
                        me.soundPlay()
                    });
                    me.ifOnEdgeBounds();
                    await P.Utils.wait(P.Env.pace);
                }
            });
        });


    });
}