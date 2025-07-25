const urlInput = document.getElementById('url-input')
const errorMessageEl = document.getElementById('error-message')
const activateBtn = document.getElementById('activate-btn')
const linksHistoryEl = document.getElementById('links-history')

function getUrlInput() {
    return urlInput.value.trim().toLowerCase()
}

// REQUEST ACCESS HERE: https://cors-anywhere.herokuapp.com/corsdemo
async function shortenUrl(urlLink) {
    const apiUrl = `https://cors-anywhere.herokuapp.com/https://cleanuri.com/api/v1/shorten`

    const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'url': urlLink
        })
    })

    if(res.ok) {
        const data = await res.json()
        displayToLinksHistory(urlLink, data)
    } else {
        console.error(`Error shortening URL: ${res.statusText}`)
    }
}

function isValidUrl(url) {
    try {
        new URL(url)
        return true
    } catch (_) {
        return false
    }
}

function displayToLinksHistory(originalLink, urlData) {
    const linkItem = document.createElement('div')
    linkItem.classList.add('item')

    linkItem.innerHTML = `
        <p class='link'>${originalLink}</p>

        <hr>

        <div class='short-link'>
            <p>${urlData.result_url}</p>
            <button class='copy-link-btn'>Copy</button>
        </div>
    `

    linksHistoryEl.appendChild(linkItem)

    linkItem.querySelector('.copy-link-btn').addEventListener('click', (e) => {
        let copyUrl = urlData.result_url
        navigator.clipboard.writeText(copyUrl)

        e.target.style.backgroundColor = 'var(--dark-violet)'
        e.target.textContent = 'Copied!'

        setTimeout(() => {
            e.target.style.backgroundColor = 'var(--cyan)'
            e.target.textContent = 'Copy'
        }, 1500)
    })
}

activateBtn.addEventListener('click', () => {
    userURL = getUrlInput()

    if(!userURL || !isValidUrl(userURL)) {
        errorMessageEl.classList.add('error')
        urlInput.classList.add('error')
    } else {
        errorMessageEl.classList.remove('error')
        urlInput.classList.remove('error')
        urlInput.value = ''
        linksHistoryEl.classList.add('active')
        shortenUrl(userURL)
    }
})

