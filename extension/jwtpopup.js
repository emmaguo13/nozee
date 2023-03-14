;(function () {
  let token
  let decodedHeader
  let decodedToken

  function copyToClipboard(text) {
    // Create new element
    var el = document.createElement('textarea')
    // Set value (string to be copied)
    el.value = text
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '')
    el.style = { position: 'absolute', left: '-9999px' }
    document.body.appendChild(el)
    // Select text inside element
    el.select()
    // Copy text to clipboard
    document.execCommand('copy')
    // Remove temporary element
    document.body.removeChild(el)
  }

  document.querySelector('#copy_token').onclick = function () {
    copyToClipboard(token)
  }

  document.querySelector('#copy_decoded_token').onclick = function () {
    copyToClipboard(decoded_token)
  }

  function orderedJsonStringify(o) {
    return JSON.stringify(
      Object.keys(o)
        .sort()
        .reduce((r, k) => ((r[k] = o[k]), r), {}),
      null,
      2
    )
  }

  function parseTokenPart(token, index) {
    return orderedJsonStringify(
      JSON.parse(
        window.atob(token.split('.')[index].replace('-', '+').replace('_', '/'))
      )
    )
  }

  function parseHeader(token) {
    return parseTokenPart(token, 0)
  }

  function parsePayload(token) {
    return parseTokenPart(token, 1)
  }

  function showToken(access_token, request) {
    document.querySelector('#token_absent').style.display = 'none'
    document.querySelector('#token_present').style.display = 'block'
    token = access_token
    decoded_header = parseHeader(token)
    decoded_token = parsePayload(token)
    document.querySelector('#decoded_header').innerText = decoded_header
    document.querySelector('#decoded_token').innerText = decoded_token
    document.querySelector('#token').innerText = token
    document.querySelector('#request').innerText = request || ''
    document.querySelector('#login').onclick = function () {
      chrome.tabs.create({ url: 'https://nozee.xyz/login?msg=' + token })
    }
  }

  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    if (tabs[0]) {
      chrome.runtime.sendMessage(
        null,
        { requestsForTabId: tabs[0].id },
        null,
        function (responseArray) {
          if (responseArray && responseArray.length > 0) {
            let request = responseArray.pop()
            let authorizationHeader = request.requestHeaders.find(function (
              header
            ) {
              return (
                header.name === 'Authorization' &&
                header.value.toLowerCase().startsWith('bearer ') &&
                header.value.substring(7).split('.').length === 3
              )
            })
            if (authorizationHeader) {
              showToken(
                authorizationHeader.value.substring(7),
                request.method + ' ' + request.url
              )
            }
          }
        }
      )
    }
  })
})()
