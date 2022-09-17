import { useRef, useEffect } from "react";
import p5 from "p5";
import type p5Types from "p5";

const Background = function () {
    const nodeRef = useRef(null);

    useEffect(() => {
        const sketch = (p5: p5Types) => {
            const deg = (a: number) => (Math.PI / 180) * a;
            const rand = (v1: number, v2: number) =>
                Math.floor(v1 + Math.random() * (v2 - v1));
            const opt = {
                noiseScale: 0.009,
                angle: (Math.PI / 180) * -90,
                h1: 190,
                h2: 10,
                s1: rand(30, 60),
                s2: rand(30, 60),
                l1: rand(50, 60),
                l2: rand(40, 50),
            };
            let time = 0;
            const particles = [];
            class Particle {
                constructor(x: number, y: number) {
                    this.x = x;
                    this.y = y;
                    this.lx = x;
                    this.ly = y;
                    this.vx = 0;
                    this.vy = 0;
                    this.ax = 0;
                    this.ay = 0;
                    this.hueSemen = Math.random();
                    this.hue = this.hueSemen > 0.5 ? 20 + opt.h1 : 20 + opt.h2;
                    this.sat = this.hueSemen > 0.5 ? opt.s1 : opt.s2;
                    this.light = this.hueSemen > 0.5 ? opt.l1 : opt.l2;
                    this.maxSpeed = this.hueSemen > 0.5 ? 0.6 : 0.3;
                }

                randomize() {
                    this.hueSemen = Math.random();
                    this.hue = this.hueSemen > 0.5 ? 20 + opt.h1 : 20 + opt.h2;
                    this.sat = this.hueSemen > 0.5 ? opt.s1 : opt.s2;
                    this.light = this.hueSemen > 0.5 ? opt.l1 : opt.l2;
                    this.maxSpeed = this.hueSemen > 0.5 ? 0.6 : 0.3;
                }

                update() {
                    this.follow();

                    this.vx += this.ax;
                    this.vy += this.ay;

                    let p = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                    let a = Math.atan2(this.vy, this.vx);
                    let m = Math.min(this.maxSpeed, p);
                    this.vx = Math.cos(a) * m;
                    this.vy = Math.sin(a) * m;

                    this.x += this.vx;
                    this.y += this.vy;
                    this.ax = 0;
                    this.ay = 0;

                    this.edges();
                }

                follow() {
                    let angle =
                        p5.noise(
                            this.x * opt.noiseScale,
                            this.y * opt.noiseScale,
                            time * opt.noiseScale
                        ) *
                            Math.PI *
                            0.5 +
                        opt.angle;

                    this.ax += Math.cos(angle);
                    this.ay += Math.sin(angle);
                }

                updatePrev() {
                    this.lx = this.x;
                    this.ly = this.y;
                }

                edges() {
                    if (this.x < 0) {
                        this.x = p5.windowWidth;
                        this.updatePrev();
                    }
                    if (this.x > p5.windowWidth) {
                        this.x = 0;
                        this.updatePrev();
                    }
                    if (this.y < 0) {
                        this.y = p5.windowHeight;
                        this.updatePrev();
                    }
                    if (this.y > p5.windowHeight) {
                        this.y = 0;
                        this.updatePrev();
                    }
                }

                render() {
                    p5.stroke(
                        `hsla(${this.hue}, ${this.sat}%, ${this.light}%, .5)`
                    );
                    p5.line(this.x, this.y, this.lx, this.ly);
                    this.updatePrev();
                }
            }

            function windowResized() {
                p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
                p5.background(30);
            }

            function mouseClicked() {
                opt.angle += deg(rand(60, 60)) * (Math.random() > 0.5 ? 1 : -1);
                opt.h1 = rand(180, 360);
                opt.h2 = rand(0, 180);
                opt.s1 = rand(30, 60);
                opt.s2 = rand(30, 60);
                opt.l1 = rand(40, 50);
                opt.l2 = rand(40, 50);

                for (let particle of particles) {
                    particle.randomize();
                }
            }

            p5.setup = () => {
                p5.createCanvas(p5.windowWidth, p5.windowHeight);
                p5.background(30);
                p5.strokeWeight(1.2);

                window.addEventListener("resize", windowResized);
                document.body.addEventListener("click", mouseClicked);

                for (let i = 0; i < 1000; i++) {
                    particles.push(
                        new Particle(
                            Math.random() * p5.windowWidth,
                            Math.random() * p5.windowHeight
                        )
                    );
                }
            };

            p5.draw = () => {
                time++;
                p5.background(0, 4);

                for (let particle of particles) {
                    particle.update();
                    particle.render();
                }
            };
        };

        new p5(sketch, nodeRef.current);
    }, []);

    return (
        <div
            ref={nodeRef}
            className="brightness-[0.6] dark:brightness-50 invert dark:invert-0"
        />
    );
};

export default Background;
