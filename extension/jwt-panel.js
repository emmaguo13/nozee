var options = {
  header_name: 'authorization',
  header_prefix: ['Bearer '],
  copy_prefix: false
}

function setOptions(o) {
  options.header_name = o.header_name.toLowerCase().trim()
  options.header_prefix =
    typeof o.header_prefix == 'string'
      ? o.header_prefix.split(',')
      : o.header_prefix
  options.copy_prefix = o.copy_prefix
  for (var i = 0; i < options.header_prefix.length; i++) {
    if (
      options.header_prefix[i].trim().length > 0 &&
      !options.header_prefix[i].endsWith(' ')
    ) {
      options.header_prefix[i] += ' '
    }
  }
  var caption = document.getElementById('caption')
  var p =
    options.header_prefix.length > 1
      ? '{' + options.header_prefix.join() + '}'
      : options.header_prefix[0]
  caption.innerHTML = 'Waiting for auth JWT to come thru...'
  // // caption.innerHTML = 'Waiting for request with <b>'+Encoder.htmlEncode(o.header_name)+
  //                     ': '+Encoder.htmlEncode(p)+' [token]</b>'+
  //                     '<br>(Go to <b>Extentions > JWT Inspector > Options</b> to customize)';
}

function bearer_token(h) {
  if (h && h.name && h.name.toLowerCase() == options.header_name && h.value) {
    var p = options.header_prefix.find(s => h.value.startsWith(s))
    if (p) {
      return { prefix: p, tok: h.value.substring(p.length) }
    }
  }
  return null
}

function isObject(obj) {
  var type = typeof obj
  return type === 'function' || (type === 'object' && !!obj)
}

const ts_claims = ['exp', 'iat', 'nbf']

function render(url, time) {
  var caption = document.getElementById('caption')
  // caption.innerHTML = "Bearer token extracted from request to "+Encoder.htmlEncode(String(url));
  caption.innerHTML = 'JWT extracted!'
  var ts = document.createElement('span')
  ts.className = 'ts'
  ts.appendChild(document.createTextNode(Encoder.htmlEncode(String(time))))
  caption.appendChild(ts)
}

function updateCopyButton(p, tok) {
  var b = document.getElementById('copy_token')
  b.dataset.token = options.copy_prefix ? p + tok : tok
  b.disabled = false
}

function openZKblind() {
  var token = this.dataset.token
  var url = 'http://localhost:3000/login?msg=' + token
  window.open(url)
  // copyTextToClipboard(t);
}

function onRequestFinished(request) {
  var h = bearer_token(request.request.headers.find(bearer_token))
  if (!h) return
  try {
    render(request.request.url, request.startedDateTime)
    updateCopyButton(h.prefix, h.tok)
  } catch (error) {
    // Not a token we can extract and decode
  }
}

chrome.devtools.network.onRequestFinished.addListener(onRequestFinished)
window.onload = function () {
  document.getElementById('copy_token').onclick = openZKblind
  chrome.storage.local.get(options, setOptions)
}
chrome.storage.onChanged.addListener(function (changes, namespace) {
  chrome.storage.local.get(options, setOptions)
})
