# Estructura de usuarios (base de datos)

Qué datos tiene un usuario recién registrado?
- id
- nombre
- apellido
- email
- password
- isFreelancer: false
- opinionesHechas (referencia?)

Qué datos tiene un usuario que es freelancer
- _id:
- nombre: string
- apellido: string
- email: string
- password: hash con bcrypt
- LinkedIn: string
- Portfolio: string
- opiniones: array de opiniones (referencia?)
- modalidades: array de strings (decís que va o lo sacamos?) (no lo puse)
- servicios: array de strings (referencia o cómo master?)
- clasesGratis: boolean
    - cantClasesGratis: number
- IsFreelancer: true
- descripcion: string
- tarifa: number del 0 al 100.000
- isDisponible: boolean
