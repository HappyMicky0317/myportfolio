import items from './items.js'
import tags from './tags.js'
import Experience from '../../Experience.js'

export default class WorkRender {

    domElements = {
        renderContainer: document.getElementById('work-render-container')
    }

    constructor() {
        this.experience = new Experience()
        this.sounds = this.experience.sounds

        this.items = items
        this.tags = tags

        this.renderItems()
    }

    renderItems() {
        this.items.forEach((item) => {
            this.domElements.renderContainer.insertAdjacentHTML('beforeend', `
            <div id="work-item-${item.id}" class="work-item-container column">
                <img class="work-item-image" src="${item.image}" alt="${item.alt}" height="300" width="334"/>
                <div class="work-item-content-container">
                    <h3>${item.name}</h3>
                    <div class="work-item-tag-container row">
                        ${this.renderTags(item.tags)}
                    </div>
                    <span>${item.description}</span>
                </div>
                <div class="work-item-button-container row">
                    ${this.renderButtons(item)}
                </div>
                ${item.bannerIcons ? this.renderBanner(item) : ''}
            </div>
            `)

            this.addEventListenersToCard(item)
        })
    }

    renderBanner(item) {
        let content = ''

        content = `
            <div class="work-banner-container row center">
                ${item.bannerIcons.map(icon =>  {
                    return `<img src="${icon.src}" alt="${icon.alt}" height="64" width="64"/>`
                })}
                <span>Website Of<br>The Day</span>
            </div>
        `

        return content
    }

    renderButtons(item) {
        let content = ''

        if (item.github) {
            content = `
                <div id="work-item-gray-button-${item.id}" class="work-item-gray-button center gray-hover" ${item.liveview ? '' : 'style="width: 100%"'}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"  class="code-icon">
                        <use href="#code-path"/>
                    </svg>
                 ${item.liveview ? '' : '<span>Source Code</span>'}
                </div>
                 ${item.liveview ? `<div id="work-item-orange-button-${item.id}" class="work-item-orange-button small-button center orange-hover">Live View</div>` : ''}
            `
        } else if (item.twitter) {
            content = `
            <div id="work-item-orange-button-${item.id}" class="work-item-orange-button small-button center orange-hover" style="width: 100%; margin: 0;">
                <svg fill="#ffffff" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 30 30" width="24px" height="24px" style="margin-right: 5px">    
                    <path d="M28,6.937c-0.957,0.425-1.985,0.711-3.064,0.84c1.102-0.66,1.947-1.705,2.345-2.951c-1.03,0.611-2.172,1.055-3.388,1.295 c-0.973-1.037-2.359-1.685-3.893-1.685c-2.946,0-5.334,2.389-5.334,5.334c0,0.418,0.048,0.826,0.138,1.215 c-4.433-0.222-8.363-2.346-10.995-5.574C3.351,6.199,3.088,7.115,3.088,8.094c0,1.85,0.941,3.483,2.372,4.439 c-0.874-0.028-1.697-0.268-2.416-0.667c0,0.023,0,0.044,0,0.067c0,2.585,1.838,4.741,4.279,5.23 c-0.447,0.122-0.919,0.187-1.406,0.187c-0.343,0-0.678-0.034-1.003-0.095c0.679,2.119,2.649,3.662,4.983,3.705 c-1.825,1.431-4.125,2.284-6.625,2.284c-0.43,0-0.855-0.025-1.273-0.075c2.361,1.513,5.164,2.396,8.177,2.396 c9.812,0,15.176-8.128,15.176-15.177c0-0.231-0.005-0.461-0.015-0.69C26.38,8.945,27.285,8.006,28,6.937z"/>
                </svg>
                Stay up to date
            </div>`
        } else {
            content = `
                <div id="work-item-gray-button-${item.id}" class="work-item-gray-button center" style="width: 100%; background: #a7adb8; cursor: unset;">
                    Work in progress
                </div>
            `
        }

        return content
    }

    renderTags(tags) {
        let contentToReturn = ''

        //get requested tag from tags.js file
        for (let i = 0; i < tags.length; i++) {
            contentToReturn += this.tags[tags[i]]
        }

        return contentToReturn
    }


    addEventListenersToCard(item) {
        const container = document.getElementById('work-item-' + item.id)

        // Inactive Container click
        container.addEventListener('click', () => {
            if (container.classList.contains('work-inactive-item-container') && document.getElementById('work-item-0').classList.contains('work-item-container-transition')) {
                this.experience.ui.work.cards.currentItemIndex = -item.id + 4
                this.experience.ui.work.cards.updatePositions()
                this.sounds.play('buttonClick')
            }
        })

        if (item.github) {
            // Gray button click
            document.getElementById('work-item-gray-button-' + item.id).addEventListener('click', () => {
                window.open(item.github, '_blank').focus()
            })

            // orange button click
            if (item.liveview) {
                document.getElementById('work-item-orange-button-' + item.id).addEventListener('click', () => {
                    window.open(item.liveview, '_blank').focus()
                })
            }
        } else if (item.twitter) {
            // orange button click
            document.getElementById('work-item-orange-button-' + item.id).addEventListener('click', () => {
                window.open(item.twitter, '_blank').focus()
            })
        }
    }
} 