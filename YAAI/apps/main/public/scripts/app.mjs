import { router } from '../../modules/utils/router.mjs';
import MainApp from '../../modules/components/main-app.mjs';

router.updateRoute(window.location.pathname);
document.body.hidden = false;

customElements.define('main-app', MainApp);