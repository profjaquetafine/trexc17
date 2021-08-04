var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;

var trex, trex_correndo, trex_colidiu;
var solo, soloinvisivel, imagemdosolo;

var nuvem, grupodenuvens, imagemdanuvem;
var grupodeobstaculos, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

var pontuacao;
var imgFimDeJogo,imgReiniciar
var somSalto , somCheckPoint, somMorte

function preload(){
  //Pre carregamento das animações do Trex
  trex_correndo = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_colidiu = loadAnimation("trex_collided.png");
  //Pre carremento imagem do solo
  imagemdosolo = loadImage("ground2.png");
  //Pre carregamento das nuvem
  imagemdanuvem = loadImage("cloud.png");
  //Pre carregamento dos obstaculos (cactos)
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
  // Game over e Restart 
  imgReiniciar = loadImage("restart.png")
  imgFimDeJogo = loadImage("gameOver.png")
  //Sons do jogo
  somSalto = loadSound("jump.mp3")
  somMorte = loadSound("die.mp3")
  somCheckPoint = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);

  //Personagem Trex
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("collided", trex_colidiu);
  trex.scale = 0.5;
  // Colisão do Trex com outros objetos    
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  //trex.debug = true
  
  //Solo visivel (imagem)
  solo = createSprite(200,180,400,20);
  solo.addImage("ground",imagemdosolo);
  solo.x = solo.width /2;
  // Solo Invisivel (apoio trex)
  soloinvisivel = createSprite(200,190,400,10);
  soloinvisivel.visible = false;
 // GameOver 
  fimDeJogo = createSprite(300,100);
  fimDeJogo.addImage(imgFimDeJogo);
  fimDeJogo.scale = 0.5;
// Restart
  reiniciar = createSprite(300,140);
  reiniciar.addImage(imgReiniciar);
  reiniciar.scale = 0.5;
       
  //criar grupos de obstáculos e de nuvens
  grupodeobstaculos = createGroup();
  grupodenuvens = createGroup();
    
  pontuacao = 0;
  
}

function draw() {
 // cor da tela
  background(180);
  //Marcar ponuação na tela
  text("Pontuação: "+ pontuacao, 500,50);
    
  // modo jogo
  if(estadoJogo === JOGAR){
   
    fimDeJogo.visible = false
    reiniciar.visible = false
    //mudar a animação do Trex para correndo ao iniciar
        trex.changeAnimation("running", trex_correndo);

    solo.velocityX = -(4 + 3* pontuacao/100)
    //Contar ponruação de acordo com o Frame
    pontuacao = pontuacao + Math.round(frameRate()/60);
    // A cada 100 pontos tocar o som
    if(pontuacao>0 && pontuacao%100 === 0){
      somCheckPoint.play() 
    }
    //Solo (gerado para dar tela infinita)
    if (solo.x < 0){
      solo.x = solo.width/2;
    }
    
    //saltar quando a tecla de espaço é pressionada e posiçãox maior que 160
    if(keyDown("space")&& trex.y >= 160) {
       trex.velocityY = -12;
       somSalto.play();
  }
  
    //adicionar gravidade ao trex quando saltar
    trex.velocityY = trex.velocityY + 0.8
   
    //gerar as nuvens
    gerarNuvens();
  
    //gerar obstáculos no solo
    gerarObstaculos();
    
    // Trex tocando nos cactos
    if(grupodeobstaculos.isTouching(trex)){
        estadoJogo = ENCERRAR;
        somMorte.play()
      
    }
  }
  // modo jogo após trex tocar os cactos (encerrar)  
  else if (estadoJogo === ENCERRAR) {
    //gamer over e restart na tela  
    fimDeJogo.visible = true;
      reiniciar.visible = true;
      //altera a animação do Trex para colidiu
      trex.changeAnimation("collided", trex_colidiu);
      //zerar a velocidade (tudo para)        
      solo.velocityX = 0;
      trex.velocityY = 0
            
      //tempo de vida dos objetos
    grupodeobstaculos.setLifetimeEach(-1);
    grupodenuvens.setLifetimeEach(-1);
     
     grupodeobstaculos.setVelocityXEach(0);
     grupodenuvens.setVelocityXEach(0); 

     }
  
  
  //Colisão do Trex no solo para não cair da "tela"
  trex.collide(soloinvisivel);
// clique do mouse na imagem reiniciar
if(mousePressedOver(reiniciar)){
  reset();
  
}    
  drawSprites();
}

function reset(){
  // tudo o que precisamos reiniciar no jogo
  estadoJogo=JOGAR
   estados = JOGAR;
  reiniciar.visible = false;
  fimDeJogo.visible = false;
  // destruir para evitar que o jogo reinicie tocando nos obstaculos e nuvens paradas
  grupodeobstaculos.destroyEach();
  grupodenuvens.destroyEach();
  // trex volta a correr
  trex.changeAnimation("running", trex_correndo);
  pontuacao =  0;
  
  
  
}


function gerarObstaculos(){
 if (frameCount % 60 === 0){
   var obstaculo = createSprite(600,165,10,40);
  obstaculo.velocityX = -(6 + pontuacao/100);
      
    //gerar números aleatórios para os obstaculos (1 a 6)
    var rand = Math.round(random(1,6));
    switch(rand) {
      // cada Obstaculo pertence a um número
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      case 3: obstaculo.addImage(obstaculo3);
              break;
      case 4: obstaculo.addImage(obstaculo4);
              break;
      case 5: obstaculo.addImage(obstaculo5);
              break;
      case 6: obstaculo.addImage(obstaculo6);
              break;
      default: break;
    }
   
    //Tamanho dos Cactos (obstaculos)       
    obstaculo.scale = 0.5;
    //Tempo de vida dos Cactos (obstaculos)
    obstaculo.lifetime = 300;
   
    //adicionar os obstáculo ao grupo
    grupodeobstaculos.add(obstaculo);
 }
}

function gerarNuvens() {
  //escreva o código aqui para gerar as nuvens 
  if (frameCount % 60 === 0) {
    nuvem = createSprite(600,100,40,10);
    nuvem.y = Math.round(random(80,160));
    nuvem.addImage(imagemdanuvem);
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
    
     //atribuir tempo de duração à variável
    nuvem.lifetime = 200; 
    
    //ajustando a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
        
    //adiciondo nuvem ao grupo
   grupodenuvens.add(nuvem);
  }
}

