class A {
  constructor () {}

  get aa () {
    console.log(`getting ${A.bb}`)
    return A.bb
  }

  set aa (val) {
    console.log(`a is ${val}`)
  }

  static get['bb'] () {
    return 2
  }

  static get['aa'] () {
    return 4
  }

}

A.aa = 1

console.log(new A().aa = 999)
console.log('---')
console.log(A.aa)
console.log(A.bb)
console.log(new A().aa)

class B extends A {
  constructor () {
    super()
  }
}

class C extends B {
  constructor () {
    super()
  }
}

let a = new A()
let b = new B()
let c = new C()

// console.log(c instanceof C)
// console.log(c instanceof B)
// console.log(c instanceof A)
