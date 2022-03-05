const data = Array.from({ length: 100 }).map((_, i) => `Item ${i + 1}`)

let itemsPerPage = 5
const state = {
    page: 1,
    itemsPerPage,
    totalPages: Math.ceil(data.length / itemsPerPage),
    maxVisibleButtons: 5
}

const html = {
    get(element) {
        return document.querySelector(element)
    }
}

const controls = {
    next() {
        if (state.page < state.totalPages) {
            state.page++
        }
    },
    prev() {
        if(state.page > 1) {
            state.page--
        }
    },
    goTo(page) {
        if (page >= 1 && page <= state.totalPages) {
            state.page = page
        }
    },
    createListeners() {
        html.get('.next').onclick = () => {
            controls.next()
            update()
        }
        html.get('.prev').onclick = () => {
            controls.prev()
            update()
        }
        html.get('.first').onclick = () => {
            controls.goTo(1)
            update()
        }
        html.get('.last').onclick = () => {
            controls.goTo(state.totalPages)
            update()
        }
    }
}

const list = {
    create(item) {
        const div = document.createElement('div')
        div.classList.add('item')
        div.innerHTML = item

        html.get('.list').appendChild(div)
    },
    update() {
        html.get('.list').innerHTML = ""

        let page = state.page - 1
        let start = page * state.itemsPerPage
        let end = start + itemsPerPage

        const pagenatedItems = data.slice(start, end)

        pagenatedItems.forEach(list.create)
    }
}

const buttons = {
    element: html.get('.controls .numbers'),
    create(number) {
        const button = document.createElement('div')
        
        button.innerHTML = number

        if (state.page == number) {
            button.classList.add('active')
        }

        button.onclick = (event) =>  {
            const page = Number(event.target.innerText)
            
            controls.goTo(page)
            update()
        }

        buttons.element.appendChild(button)
    },
    update() {
        buttons.element.innerHTML = ''
        const { maxLeft, maxRight } = buttons.calculateMaxVisible()

        for (let page = maxLeft; page <= maxRight; page++) {
            buttons.create(page)
        }
    },
    calculateMaxVisible() {
        const { maxVisibleButtons } = state
        let maxLeft = (state.page - Math.floor(maxVisibleButtons / 2))
        let maxRight = (state.page + Math.floor(maxVisibleButtons / 2))

        if (maxRight > state.totalPages) {
            maxLeft = state.totalPages - (maxVisibleButtons - 1)
            maxRight = state.totalPages
        }

        if (maxLeft < 1) {
            maxLeft = 1
            maxRight = maxVisibleButtons
        }

        return {maxLeft, maxRight}
    }
}

function update() {
    list.update()
    buttons.update()
}

function init() {
    update()
    controls.createListeners()
}

init()
