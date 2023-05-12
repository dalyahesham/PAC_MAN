const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const scoreEL = document.querySelector("#scoreEL");              // بتاع الscore     ***********************
// console.log(scoreEL)

canvas.width = innerWidth;
canvas.height = innerHeight;

console.log(canvas);

class Boundary {
    static width = 40;
    static height = 40;
    constructor({ position , image}) {
        this.position = position;
        this.width = 40;
        this.height = 40;
        this.image=image;
    }
    draw() {
        // c.fillStyle = "rgb(255, 136, 155)";
        // c.fillRect(this.position.x, this.position.y, this.width, this.height);
        c.drawImage(this.image,this.position.x,this.position.y)
    }
}



let lastKey = "";
let score = 0                     //*******************************************************************
const map = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
  ];

  //               ----------------------------------------------------------------------

class Player {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.radians=0.75;
        this.openRate=0.12
        this.rotation=0
    }
    draw() {
        c.save();
        c.translate(this.position.x,this.position.y);
        c.rotate(this.rotation)
        c.translate(-this.position.x,-this.position.y);
        c.beginPath();
        c.arc(this.position.x,
             this.position.y, 
             this.radius, 
             this.radians,         
             Math.PI * 2-this.radians
        );
        c.lineTo(this.position.x,this.position.y)
        c.fillStyle = "yellow";
        c.fill();
        c.closePath();
        c.restore();
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if(this.radians < 0 || this.radians > 0.75)this.openRate=-this.openRate
        this.radians+=this.openRate

        
    }
}


class Ghost {
    static speed=2
    constructor({ position, velocity , color="red" }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.color=color
        this.prevCollisions=[]
        this.speed=2
        this.scaerd=false
    }
    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle =this.scaerd ?  'blue' : this.color
        c.fill();
        c.closePath();
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}



class Pellet {
    constructor({ position }) {
        this.position = position;
        this.radius = 3;
    }
    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = "rgb(173, 173, 183)";
        c.fill();
        c.closePath();
    }
    
}

class PowerUp {                                    //power pellet
    constructor({ position }) {
        this.position = position;
        this.radius = 8;
    }
    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = "rgb(173, 173, 183)";
        c.fill();
        c.closePath();
    }
    
}

const pellets=[] ;              // generte pallets
const boundaries = [];
const PowerUps=[]
const ghosts=[                           // function
    new Ghost({
        position:{
            x:Boundary.width*6 + Boundary.width / 2,
            y: Boundary.height + Boundary.height / 2,
        },
        velocity:{
            x:Ghost.speed,
            y:0
        }
    }),
    new Ghost({
        position:{
            x:Boundary.width*6 + Boundary.width / 2,
            y: Boundary.height*3+ Boundary.height / 2,
        },
        velocity:{
            x:Ghost.speed,
            y:0
        },
        color:"pink"
    }),
    new Ghost({
        position:{
            x:Boundary.width*3 + Boundary.width / 2,
            y: Boundary.height*5+ Boundary.height / 2,
        },
        velocity:{
            x:Ghost.speed,
            y:0
        },
        color:"green"
    })
];
const player = new Player({
    position: {
        x: Boundary.width + Boundary.width / 2,      // عشان اخلى مكان الباك مان فوق على الشمال مش لامس الحدود
        y: Boundary.height + Boundary.height / 2,     // اول م اللعبه تبدا 
    },
    velocity: {
        x: 0,
        y: 0,
    },
});

const keys = {
    w: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    s: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
};
function creatImage(src){         // بجمع الصور عشان ارسم شكل الحدود من برا والجدران من برا 
    const image=new Image()
    image.src=src
    return image
    

}



          //              ------------------------------------------------------------

map.forEach((row, i) => {                                     // i==> index of rows 
    row.forEach((Symbol, j) => {                              // j==> index of columns 
        // console.log(Symbol);
        switch (Symbol) {  

            case "-":
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i,
                        },
                        image: creatImage("./images/pipeHorizontal.png")
                    })
                );
                break;

            case "|":
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i,
                        },
                        image: creatImage("./images/pipeVertical.png")
                    })
                );
                break;

            case "1":                                   // عمل حدود اللعبه من فوق شمال 
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i,
                        },
                        image: creatImage("./images/pipeCorner1.png")
                    })
                );
                break;

            case "2":                         // حدود اللعبه فوق يمين 
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i,
                        },
                        image: creatImage("./images/pipeCorner2.png")
                    })
                );
                break;

            case "3":                    //حدود اللعبه تحت يمين 
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i,
                        },
                        image: creatImage("./images/pipeCorner3.png")
                    })
                );
                break;

            case "4":                // حدود اللعبه تحت شمال
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i,
                        },
                        image: creatImage("./images/pipeCorner4.png")
                    })
                );
                break;

            case "b":               
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i,
                        },
                        image: creatImage("./images/block.png")
                    })
                );
                break;

            case '[':               
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i,
                        },
                        image: creatImage('./images/capLeft.png')
                    })
                );
                break;

            case ']':               
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i,
                        },
                        image: creatImage('./images/capRight.png')
                    })
                );
                break;

            case '_':               
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i,
                        },
                        image: creatImage('./images/capBottom.png')
                    })
                );
                break;

            case '^':               
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i,
                        },
                        image: creatImage('./images/capTop.png')
                    })
                );
                break;

            case '+':               
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i,
                        },
                        image: creatImage('./images/pipeCross.png')
                    })
                );
                break;

            case '5':               
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i,
                        },
                        image: creatImage('./images/pipeConnectorTop.png')
                    })
                );
                break;

            case '6':               
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i,
                        },
                        image: creatImage('./images/pipeConnectorRight.png')
                    })
                );
                break;


            case '7':               
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i,
                        },
                        image: creatImage('./images/pipeConnectorBottom.png')
                    })
                );
                break;


            case '8':               
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i,
                        },
                        image: creatImage('./images/pipeConnectorLeft.png')
                    })
                );
                break;


            case '.':
                pellets.push(
                    new Pellet({
                        position: {
                          x: j * Boundary.width + Boundary.width / 2,
                          y: i * Boundary.height + Boundary.height / 2                       
                        } 
                    
                    })
                )
                break
                case 'p':
                PowerUps.push(
                    new PowerUp({
                        position: {
                          x: j * Boundary.width + Boundary.width / 2,
                          y: i * Boundary.height + Boundary.height / 2                       
                        } 
                    
                    })
                )
                break    
        }

    })
})


   //        -----------------------------------------------------------------------------------



function circleCollidesWithRectangle({circle,rectangle}){
    
    const padding=Boundary.width/2 - circle.radius - 1
    return(
        circle.position.y - circle.radius + circle.velocity.y <=
        rectangle.position.y + rectangle.height+padding &&
        circle.position.x + circle.radius + circle.velocity.x >=
        rectangle.position.x-padding &&
        circle.position.y + circle.radius + circle.velocity.y >=
        rectangle.position.y - padding &&
        circle.position.x - circle.radius + circle.velocity.x <=
        rectangle.position.x + rectangle.width + padding
    )

}

         // -------------------------------------------------------------------------------------------

let animationId
function animate() {
    animationId=requestAnimationFrame(animate);
    // console.log(animationId)
    c.clearRect(0, 0, canvas.width, canvas.height);            

    if (keys.w.pressed && lastKey === "w") {                         //حدود الحركه بتاع pacman
        for(let i =0; i<boundaries.length;i++){
            const boundary=boundaries[i]           // من اول فور لبعد بريك عشان الباك مان يعرف يطلع وينزل بسهوله بين الجدار وميتعطلش 
            if(
                circleCollidesWithRectangle({
                    circle:{...player,velocity:{
                        x:0,
                        y:-5
                    }},
                    rectangle:boundary
                })
            ){
                player.velocity.y=0
                break
            }else{
                player.velocity.y=-5
            }
        }                   
        
    } else if (keys.a.pressed && lastKey === "a") {
        for(let i =0; i<boundaries.length;i++){
            const boundary=boundaries[i]         
            if(
                circleCollidesWithRectangle({
                    circle:{...player,velocity:{
                        x:-5,
                        y:0
                    }},
                    rectangle:boundary
                })
            ){
                player.velocity.x=0
                break
            }else{
                player.velocity.x=-5
            }
        }
    } else if (keys.s.pressed && lastKey === "s") {                                        
        for(let i =0; i<boundaries.length;i++){
            const boundary=boundaries[i]
            if(
                circleCollidesWithRectangle({
                    circle:{...player,velocity:{
                        x:0,
                        y:5
                    }},
                    rectangle:boundary
                })
            ){
                player.velocity.y=0
                break
            }else{
                player.velocity.y=5
            }
        }        
    } else if (keys.d.pressed && lastKey === "d") {
        for(let i =0; i<boundaries.length;i++){
            const boundary=boundaries[i]         
            if(                                    // عشان اشوف وقت م هو بيتحرك  وقابله جدار ميعرفش يعدى 
                circleCollidesWithRectangle({
                    circle:{...player,velocity:{
                        x:5,
                        y:0
                    }},
                    rectangle:boundary
                })
            ){
                player.velocity.x=0
                break
            }else{
                player.velocity.x=5
            }
        }
    }


//               ---------------------------------------------------------------------------------

    //detect collision between ghosts and player
    for(let i=ghosts.length - 1 ; 0<=i ; i--){            // لو الباك مان وحد م الكور التانيه اتقابلو فى وضع الاسكير 
        const ghost=ghosts[i]                                               // الباك مان ياكلهم 
    


    // ghost touch player

        if (Math.hypot(ghost.position.x-player.position.x,
            ghost.position.y-player.position.y)<ghost.radius+player.radius ){
                if (ghost.scaerd){
                    ghosts.splice(i,1)
                }
                else{
                    cancelAnimationFrame(animationId)
                    console.log("you lose ")

                }
                


            }        
    } 

    // win conition goes here
    if (pellets.length === 0){
        console.log("you win")
        cancelAnimationFrame(animationId)

    }

    //powerups go
    for(let i=PowerUps.length - 1 ; 0<=i ; i--){
        const PowerUp=PowerUps[i]
        PowerUp.draw()              


        // player collides with powerUps
        if (Math.hypot(PowerUp.position.x-player.position.x,
            PowerUp.position.y-player.position.y)<PowerUp.radius+player.radius)
            {
                PowerUps.splice(i,1)   // عشان الباك مان يعرف ياكلها زى الكور الصغيره 

                // make ghosts scare

                ghosts.forEach(ghost=>{
                    ghost.scaerd=true
                    // console.log(ghost.scaerd)

                    setTimeout(()=> {
                        ghost.scaerd=false
                        // console.log(ghost.scaerd)
                    },5000)


                })
            } 

    }             
    
        //الجزء دااا عشان لما الباك مان يعدى على النقط البيضا تتختفى " ياكلها يعنى"
        // هنا قولت -1 لانه هو اصلا بيبدا من عند الاندكس صفر
        //touch pallets here
    for(let i=pellets.length - 1 ; 0<=i ; i--){
        const Pellet=pellets[i]
        Pellet.draw()               // hypot ==> difference of distance between our player and pellets

        if (Math.hypot(Pellet.position.x-player.position.x,
            Pellet.position.y-player.position.y)<Pellet.radius+player.radius){
                //console.log("touching")
                pellets.splice(i,1)       //دى اللى هتخلى لما اعدى على اى كره بيضا تتاكل 
                score += 10            //**************************************************
                // scoreEL.innerHTML=  score
                // scoreEL.innerHTML= score      //************************************************ */
        }         
            

    }             
    
    const collisions=[]      // التصادم.
    boundaries.forEach((boundary) => {
        boundary.draw();
        if (
            !collisions.includes("right")&&
            circleCollidesWithRectangle({
                circle: player ,
                rectangle: boundary
            })
        ) {
            player.velocity.x = 0;
            player.velocity.y = 0;
        }
    });
    player.update();


    ghosts.forEach(ghost=>{
        ghost.update()
        
        const collisions=[]
        boundaries.forEach(boundary=>{            // دا عشان الجوست لما ييجى يتحرك بشكل عشوائى يعرف مكان 

            if( 
                !collisions.includes("right")&&                                  // الحدوود ولو قابلته معرفش يتخاها ويرجع تانى
                circleCollidesWithRectangle({
                    circle:{...ghost,velocity:{
                        x:ghost.speed,
                        y:0
                    }},
                    rectangle:boundary
                })
            ){
            collisions.push('right')
            }

            if(
                !collisions.includes("left")&&
                circleCollidesWithRectangle({
                    circle:{...ghost,velocity:{
                        x:-ghost.speed,
                        y:0
                    }},
                    rectangle:boundary
                })
            ){
            collisions.push('left')
            }

            if(
                !collisions.includes("up")&&
                circleCollidesWithRectangle({
                    circle:{...ghost,velocity:{
                        x:0,
                        y:-ghost.speed
                    }},
                    rectangle:boundary
                })
            ){
            collisions.push('up')
            }

            if(
                !collisions.includes("down")&&
                circleCollidesWithRectangle({
                    circle:{...ghost,
                        velocity:{
                        x:0,
                        y:ghost.speed
                        }
                    },
                    rectangle:boundary
                })
            ){
            collisions.push('down')
            }

        })

        if(collisions.length>ghost.prevCollisions.length)
            ghost.prevCollisions=collisions
        
        if(JSON.stringify(collisions)!== JSON.stringify(ghost.prevCollisions)){
            // console.log("gogo")
            // console.log(collisions)
            // console.log(ghost.prevCollisions)
            if(ghost.velocity.x>0) ghost.prevCollisions.push('right')
            else if(ghost.velocity.x<0) ghost.prevCollisions.push('left')
            else if(ghost.velocity.y<0) ghost.prevCollisions.push('up')
            else if(ghost.velocity.x>0) ghost.prevCollisions.push('down')

            console.log(collisions)
            console.log(ghost.prevCollisions)




            const pathways=ghost.prevCollisions.filter((collision) =>       // عشلن اعرف اماكن الحركه المتاحه فى كل اندكس
                {
                    return !collisions.includes(collision)
            })
            console.log({pathways})
            const direcation=pathways[Math.floor(Math.random() * pathways.length)]

            console.log({direcation})

            switch(direcation){
                case'down':
                    ghost.velocity.y=ghost.speed
                    ghost.velocity.x=0
                    break

                case'up':
                    ghost.velocity.y=-ghost.speed
                    ghost.velocity.x=0
                    break

                case'right':
                    ghost.velocity.y=0
                    ghost.velocity.x=ghost.speed
                    break

                case'left':
                    ghost.velocity.y=0
                    ghost.velocity.x=-ghost.speed
                    break
            }
            ghost.prevCollisions=[]

        }
        // ghost.prevCollision=collisions
        // console.log(collisions)
    })
    if(player.velocity.x > 0) player.rotation=0
    else if(player.velocity.x < 0) player.rotation=Math.PI             // left
    else if(player.velocity.y > 0) player.rotation=Math.PI/2           // up
    else if(player.velocity.y < 0) player.rotation=Math.PI*1.5          //down


}  // end of animate()
     
animate();
 
//     -------------------------------------------------------------------------------------------

addEventListener("keydown", ({ key }) => {
    switch (key) {
        case "w":
            lastKey = "w";
            keys.w.pressed = true;
            break;

        case "a":
            keys.a.pressed = true;
            lastKey = "a";
            break;

        case "s":
            keys.s.pressed = true;
            lastKey = "s";

            break;

        case "d":
            keys.d.pressed = true;
            lastKey = "d";

            break;
    }
});

addEventListener("keyup", ({ key }) => {
    switch (key) {
        case "w":
            keys.w.pressed = false;
            lastKey='w'
            break;

        case "a":
            keys.a.pressed = false;
            lastKey='a'
            break;

        case "s":
            keys.s.pressed = false;
            lastKey='s'
            break;

        case "d":
            keys.d.pressed = false;
            lastKey='d'
            break;
    }
});
    //     ----------------------------------------------------------------------------------------