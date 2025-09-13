import { css } from '../utils/render.mjs';

export default css`
  body:not([data-route]) main-app::part(dashboard-route),
  body[data-route=""] main-app::part(dashboard-route),
  body[data-route="dashboard"] main-app::part(dashboard-route) {
    display: block;
  }

  body[data-route="projects"] main-app::part(projects-route) {
    display: block;
  }

  body[data-route="recommendations"] main-app::part(recommendations-route) {
    display: block;
  }

  /* Active navigation states */
  body:not([data-route]) nav a[href="/dashboard"],
  body[data-route=""] nav a[href="/dashboard"],
  body[data-route="dashboard"] nav a[href="/dashboard"] {
    font-weight: 600;
    pointer-events: none;
  }

  body[data-route="projects"] nav a[href="/projects"] {
    font-weight: 600;
    pointer-events: none;
  }

  body[data-route="recommendations"] nav a[href="/recommendations"] {
    font-weight: 600;
    pointer-events: none;
  }

  body:not([data-route]) nav a[href="/dashboard"]::after,
  body[data-route=""] nav a[href="/dashboard"]::after,
  body[data-route="dashboard"] nav a[href="/dashboard"]::after,
  body[data-route="projects"] nav a[href="/projects"]::after,
  body[data-route="recommendations"] nav a[href="/recommendations"]::after {
    display: block;
  }
`;