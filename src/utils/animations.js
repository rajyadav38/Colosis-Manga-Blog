import anime from "animejs";

export const animateCards = () => {
  anime({
    targets: ".anime-card.glow",
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 700,
    delay: anime.stagger(100),
    easing: "easeOutQuad",
  });
};
