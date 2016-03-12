// style the <body>
b.style.cssText = 'margin:0;padding:0;background:#262747;overflow:hidden';

// keep track of canvas size
w = innerWidth;
h = innerHeight;

// an array of all of the rockets and the particles
r = [];
p = [];

// shoots a rocket every few seconds
b.onclick = function (clickEvent) {
  r.push({
    a: clickEvent.clientX,
    b: clickEvent.clientY,
    y: h
  });
};

// tick
(function T () {
  // iterate through all the rockets, clearing the list if there aren't any active
  U = 1;
  c.fillStyle = '#ffffff';
  r.map(function (rocket) {
    // skip if this rocket is already destroyed
    if (rocket.d) { return; }

    // we've updated at least 1 rocket
    U = 0;

    // shoot the rocket upward, destroying it if needed
    if ((rocket.y -= 20) < rocket.b) {
      // destroy the rocket
      rocket.d = 1;

      // generate particles
      for (R = (((Math.random() * 10) + 5) | 0); R; R--) {
        // choose this ring's color, velocity
        C = '#' + [
          'ff0000',
          'ff9900',
          'ffff00',
          '00ff00',
          '00ffff',
          'ff00ff'
        ][(Math.random() * 6) | 0];
        V = (Math.random() * 7) + 5;

        // how many particles?
        I = ((Math.random() * 20) + 5) | 10;

        // generate each particle
        for (P = I; P; P--) {
          p.push({
            c: C,
            x: rocket.a,
            y: rocket.y,
            v: V,
            s: 10,
            f: Math.cos(2 * Math.PI * P / I),
            g: Math.sin(2 * Math.PI * P / I)
          })
        }
      }
    } else {
      // draw the rocket
      c.beginPath();
      c.arc(rocket.a, rocket.y, 2, 0, 2 * Math.PI);
      c.fill();
    }
  });
  if (U) {
    r = [];
  }

  // iterate through all the particles, clearing them if you updated none
  U = 1;
  p.map(function (particle) {
    // stop if it's too slow
    if ((particle.v -= 0.2) < 0) { return; }

    // we've updated at least one particle
    U = 0;

    // slowly accelerate downward
    particle.g += 0.03;

    // move the particle
    particle.x += particle.f * particle.v;
    particle.y += particle.g * particle.v;

    // shrink
    particle.s = Math.max(particle.s -= 0.5, 1);

    // draw the particle
    c.fillStyle = particle.c;
    c.beginPath();
    c.arc(particle.x, particle.y, particle.s, 0, 2 * Math.PI);
    c.fill();
  });
  if (U) {
    p = [];
  }

  // go again
  requestAnimationFrame(T);
})();
