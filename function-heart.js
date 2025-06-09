e = [];// trails
h = [];// heart path
O = c.width = innerWidth;
Q = c.height = innerHeight;

v = 32; // num trails, num particles per trail & num nodes in heart path
M = Math;
R = M.random;
C = M.cos;
Y = 6.3;// close to 44/7 or Math.PI * 2 - 6.3 seems is close enough. 
for( i = 0; i <Y; i+= .2 ) { // calculate heart nodes, from http://mathworld.wolfram.com/HeartCurve.html
	h.push([
		O/2 + 180*M.pow(M.sin(i), 3),
		Q/2 + 10 * (-(15*C(i) - 5*C(2*i) - 2*C(3*i) - C(4*i)))
	])
}

i = 0;
while (i < v ) {

	x = R() * O;
	y = R() * Q;
	//r = R() * 50 + 200;
	//b = R() * r;
	//g = R() * b;

	H = i/v * 80 + 280;
	S = R() * 40 + 60;
	B = R() * 60 + 20;

	f = []; // create new trail

	k = 0;
	while ( k < v ) { 
		f[k++] = { // create new particle
			x : x, // position 
			y : y,
			X : 0, // velocity
			Y : 0,
			R : (1 - k/v)  + 1, // radius
			S : R() + 1, // acceleration 
			q : ~~(R() * v), // target node on heart path
			//D : R()>.5?1:-1,
			D : i%2*2-1, // direction around heart path
			F : R() * .2 + .7, // friction
			//f : "rgba(" + ~~r + "," + ~~g + "," + ~~b + ",.1)"
			f : "hsla("+~~H+","+~~S+"%,"+~~B+"%,.1)" // colour
      
		}
	}

	e[i++] = f; // dots are a 2d array of trails x particles
}

function render(_) { // draw particle
	a.fillStyle = _.f;
	a.beginPath();
	a.arc(_.x, _.y, _.R, 0, Y, 1);
	a.closePath();
	a.fill();
}

let textoAlpha = 0; // transparência inicial do texto
let textoApareceu = false;
let textoTimer = 0;

function loop(){
	a.fillStyle = "rgba(0,0,0,.2)"; // clear screen
	a.fillRect(0,0,O,Q);

	i = v;
	while (i--) {
		f = e[ i ];
		u = f[ 0 ];
		q = h[ u.q ];
		D = u.x - q[0];
		E = u.y - q[1];
		G = M.sqrt( (D * D) + (E * E) );
		if ( G < 10 ) {
			if (R() > .95 ) {
				u.q = ~~(R() * h.length);
			} else {
				if ( R() > .99) u.D *= -1;
				u.q += u.D;
				u.q %= h.length;
				if ( u.q < 0 ) u.q += h.length;
			 }
		}
		u.X += -D / G * u.S;
		u.Y += -E / G * u.S;
		u.x += u.X;
		u.y += u.Y;
		render(u);
		u.X *= u.F;
		u.Y *= u.F;
		k = 0;
		while ( k < v-1 ) {
			T = f[ k ];
			N = f[ ++k ];
			N.x -= (N.x - T.x) * .7;
			N.y -= (N.y - T.y) * .7;
			render(N);
		}
	}

    // Controle do fade-in do texto
    if (!textoApareceu) {
        textoTimer++;
        if (textoTimer > 120) { // ~2 segundos para começar a aparecer
            textoAlpha += 0.02;
            if (textoAlpha >= 1) {
                textoAlpha = 1;
                textoApareceu = true;
            }
        }
    }

    // Efeito de pulsar
    let t = Date.now() * 0.002;
    let scale = 1 + 0.08 * Math.sin(t * 2); // pulsar suave

    // Desenhar texto fixo brilhante ainda mais abaixo do coração
    a.save();
    a.globalAlpha = textoAlpha;
    a.font = `bold ${30 * scale}px Arial`;
    a.textAlign = "center";
    a.textBaseline = "middle";
    let grad = a.createLinearGradient(O/2-200, Q/2+220, O/2+200, Q/2+220);
    grad.addColorStop(0, "#ff69b4");
    grad.addColorStop(0.5, "#fff");
    grad.addColorStop(1, "#ff69b4");
    a.shadowColor = "#ff69b4";
    a.shadowBlur = 3;
    a.fillStyle = grad;
    a.fillText("Lara te amo", O/2, Q/2+220);
    a.restore();
}

(function doit(){
	requestAnimationFrame(doit);
	loop();
}());
