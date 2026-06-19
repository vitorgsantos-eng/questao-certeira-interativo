// Fix the one feedback string that got partially converted due to rule ordering.
const fs = require('fs')
const path = require('path')

const FILE = path.join(__dirname, '../content/revisions/revisao-9ano-triangulos-sistemas.json')
const data = JSON.parse(fs.readFileSync(FILE, 'utf8'))

// Mission 2, Q5 (challenge), option D feedback — was partially converted
data.missions[1].questions[4].options[3].feedback =
  'Talvez tenha calculado $h = \\frac{a}{2} = \\frac{5}{2} = 2{,}5$. ' +
  'A fórmula correta é $h = \\dfrac{a \\cdot b}{c}$. ' +
  'Calcule $b = \\sqrt{13^2-5^2} = 12$ e use $h = \\dfrac{60}{13} \\approx 4{,}6$.'

fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf8')

// Verify
const check = JSON.parse(fs.readFileSync(FILE, 'utf8'))
console.log('Fixed:', check.missions[1].questions[4].options[3].feedback)
