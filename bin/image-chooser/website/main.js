import {
  html,
  Component,
  render,
} from "https://unpkg.com/htm/preact/standalone.module.js"

const LIMIT = 20
const OFFSET = 0

const copyToClipboard = str => {
  const el = document.createElement("textarea")
  el.value = str
  document.body.appendChild(el)
  el.select()
  document.execCommand("copy")
  document.body.removeChild(el)
}

function readValues() {
  const values = JSON.parse(localStorage.getItem("values")) || []
  const savedImages = new Map()
  for (const value of values) {
    savedImages.set(value[0], value[1])
  }

  return savedImages
}

function saveValues(savedImages) {
  const values = [...savedImages]

  const json = []
  for (const value of values) {
    json.push(value[1])
  }

  window.json = JSON.stringify(json, null, 2)
  copyToClipboard(window.json)
  localStorage.setItem("values", JSON.stringify(values, null, 2))
}

class App extends Component {
  async componentDidMount() {
    let results = await (await fetch("/out/results.json")).json()
    results = _.groupBy(results, result => result.hostUrl)
    window.results = results
    const savedImages = readValues()
    this.setState({ limit: OFFSET, results, savedImages })
  }

  toggleImage(image) {
    const { savedImages } = this.state
    if (savedImages.has(image.filename)) {
      savedImages.delete(image.filename)
    } else {
      savedImages.set(image.filename, image)
    }

    saveValues(savedImages)
    copyToClipboard()

    this.setState({ savedImages })
  }

  showMore() {
    this.setState({ limit: this.state.limit + LIMIT })
  }

  render({ page }, { results, savedImages, limit }) {
    return html`
      <div class="app">
        <h1>
          ${limit} of ${Object.keys(results || {}).length} Organizations
        </h1>
        ${Object.keys(results || {})
          .slice(Math.max(0, limit - LIMIT), limit || LIMIT)
          .map(
            org => html`
              <div className="org" key=${org}>
                <h2>${org}</h2>
                <ul>
                  ${results[org].map(image => {
                    const saved = savedImages && savedImages.has(image.filename)
                    return html`
                      <li
                        key=${image.url}
                        onClick=${() => this.toggleImage(image)}
                        className="$}"
                        className="result ${saved && "saved"}"
                      >
                        <img src="${image.url}" />
                      </li>
                    `
                  })}
                </ul>
              </div>
            `
          )}
        <div className="more" onClick=${() => this.showMore()}>Show More</div>
      </div>
    `
  }
}

const Header = ({ results }) => html``

render(
  html`
    <${App} page="All" />
  `,
  document.body
)
