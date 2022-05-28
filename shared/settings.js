const DEBUG = true;

var url = DEBUG
  ? 'http://192.168.1.102:8080'
  : 'https://app.davidcorfield.co.uk';
var ws_url = DEBUG
  ? 'ws://192.168.1.102:8080/ws/'
  : 'wss://app.davidcorfield.co.uk/ws/';

const Settings = {
  siteUrl: url,
  ws_siteURL: ws_url,
  homePage: 'Feed',
  debug: DEBUG,
};

export default Settings;
