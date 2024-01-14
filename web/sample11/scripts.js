/**
 * Sample11
 * スプライト（CAT)を １秒で「どこかの」場所へ移動する
 * 
 */
P.preload = async function() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cat.svg','Cat');
}

P.prepare = async function() {
    P.stage = new P.Stage("stage");
    P.stage.addImage( P.images.Jurassic );
    P.cat = new P.Sprite("Cat");
    P.cat.position.x = 0;
    P.cat.position.y = 0;
    P.cat.addImage( P.images.Cat );
}

const _changeDirection = 1;

P.setting = async function() {
    "use strict";
    P.stage.whenFlag(async function() {
        this.addSound( P.sounds.Chill, { 'volume' : 50 } );
    });
    P.stage.whenFlag(async function() {
        for(;;) {
            await this.startSoundUntilDone();
            //await P.Utils.wait(P.Env.pace);
        }
    });
    P.cat.whenFlag(async function() {
        for(;;) {
            await P.Utils.wait(1000);
            // どこかに行く！をメソッド化したい（glideToPositionとは別のン前で）
            const x = (Math.random()-0.5) * P.stageWidth;
            const y = (Math.random()-0.5) * P.stageHeight;
            await this.glideToPosition(1, x, y);            
        }
    });
}