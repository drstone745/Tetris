document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startButton = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
        'orange',
        'blue',
        'red',
        'limegreen',
        'purple',
        'yellow',
        'cyan',
    ]

    //the Tetrominoes
    const lTetrominoes = [
        [width, width + 1, width + 2, 2],
        [0, width, width * 2, width * 2 + 1],
        [0, 1, 2, width],
        [0, 1, width + 1, width * 2 + 1],
    ]

    const jTetrominoes = [
        [0, width, width + 1, width + 2],
        [0, width, width * 2, 1],
        [0, 1, 2, width + 2],
        [1, width + 1, width * 2 + 1, width * 2],
    ]

    const zTetrominoes = [
        [0, 1, width + 1, width + 2],
        [1, width, width + 1, width * 2],
        [0, 1, width + 1, width + 2],
        [1, width, width + 1, width * 2],
    ]

    const sTetrominoes = [
        [1, 2, width, width + 1],
        [0, width, width + 1, width * 2 + 1],
        [1, 2, width, width + 1],
        [0, width, width + 1, width * 2 + 1],
    ]

    const tTetrominoes = [
        [0, 1, 2, width + 1],
        [1, width, width + 1, width * 2 + 1],
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
    ]

    const oTetrominoes = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
    ]

    const iTetrominoes = [
        [0, 1, 2, 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [0, 1, 2, 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
    ]

    const theTetrominoes = [lTetrominoes, jTetrominoes, zTetrominoes, sTetrominoes, tTetrominoes, oTetrominoes, iTetrominoes]

    let currentPosition = 4
    let currentRotation = 0
    //random select a tetrominoes and its first rotation
    let random = Math.floor(Math.random() * theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation]


    //draw the tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    //undraw the tetromino 
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''

        })
    }
    //make the tetromino move down every second

    //timerId = setInterval(moveDown, 1000)

    //asign function keycodes
    function control(e) {
        if (e.keyCode === 37) {
            moveleft()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        }
    }



    document.addEventListener('keyup', control)

    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }



    //freeze function 
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            //start a new tetromino falling
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][0]
            currentPosition = 4
            draw()
            displayShape()
            addscore()
            gameOver()
        }
    }
    //move the tetromino left, unless is at the edge or there is a blockage
    function moveleft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if (!isAtLeftEdge) currentPosition -= 1

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }
        draw()

    }

    //move tetromino right, unles at the edge or there is a blockage

    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

        if (!isAtRightEdge) currentPosition += 1

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }
        draw()
    }

    //rotate the Tetromino
    function rotate() {
        undraw()

        currentRotation++
        //if current Rotation gets to 4, amke it goes back to 0
        if (currentRotation === current.length) {
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        draw()
    }

    // show up next tetromino in mini grid display
    const displaysquaress = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 0

    //const tetrominos without rotations
    const upNextTetrominoes = [
        [displayWidth, displayWidth + 1, displayWidth + 2, 2],//lTetromino
        [0, displayWidth, displayWidth + 1, displayWidth + 2], //jTetromino
        [0, 1, displayWidth + 1, displayWidth + 2], //zTetroino
        [1, 2, displayWidth, displayWidth + 1], //sTetromino
        [0, 1, 2, displayWidth + 1], //t Tetromino
        [0, 1, displayWidth, displayWidth + 1], //o Tetromino
        [0, 1, 2, 3] //iTetromino
    ]

    function displayShape() {
        displaysquaress.forEach(squares => {
            squares.classList.remove('tetromino')
            squares.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaysquaress[displayIndex + index].classList.add('tetromino')
            displaysquaress[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })

    }

    startButton.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            displayShape()
        }
    })

    function addscore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    //game over 

    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'Game Over'
            clearInterval(timerId)
        }
    }
}
)
