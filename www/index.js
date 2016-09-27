import React from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from "./app";

injectTapEventPlugin();
render(<App/>, document.getElementById('container'));