var patologias = [
    {
        "nombre" : "TAD (Transtorno de ansiedad generalizada)",
        "preguntas" : [ 
            "La mayoría de los días me siento nervioso",
            "La mayoría de los días me preocupo por más de una cosa",
            "La mayoría de los días no puedo parar de preocuparme",
            "La mayoría de los días me resulta difícil controlar mis preocupaciones",
            "La mayoría de los días me resulta difícil controlar mis preocupaciones",
            "Me siento inquieto/a, intraquilo/a, o con los nervios disparados",
            "Me siento cansado fácilmente",
            "Tengo problemas para concentrarme",
            "Me enfado o irrito fácilmente",
            "Mis músculos están tensos y agarrotados",
            "Tengo problemas de sueño",
            "Las cosas que ha señalado anteriomente, ¿afectaron a su vida diaria (en el hogar, en el tabajo, o en su tiempo libre) o le causaron mucho malestar?",
            "Las cosas que ha señalado anteriormente, ¿fueron suficientemente molestas como para que pensara en buscar ayuda para ellas?"
        ],
        "rango" : [0, 11],
        "sintomas" : [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
    },
    {
        "nombre" : "Depresion",
        "preguntas" : [
            "Me he sentido con poca energía",
            "He perdido el interés por las cosas",
            "He perdido la confianza en mí mismo",
            "Me he sentido sin esperanza",
            "He perdido peso (causado por falta de apetito)",
            "Me he estado despertando demasiado temprano",
            "Me he sentido enlentecido",
            "Tengo tendencia a encontrarme peor por las mañanas"
        ],
        "rango" : [12, 19],
        "sintomas" : [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0 ]
    },
    {
        "nombre" : "Sintomas psicoticos",
        "preguntas" : [
            "He escuchado murmullos en los oídos",
            "Tengo tendencia a aislarme de las personas",
            "Me he sentido observado"
        ],
        "rango" : [20, 22],
        "sintomas" : [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1 ]
    }
];

module.exports = {
    /* Devuelve la variable preguntas */
    all: function() {
        return patologias;
    }
}