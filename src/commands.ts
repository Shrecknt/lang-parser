module.exports = {
    "set/int": [
        { "type": "word", "name": "var" },
        { "type": "int", "name": "value" }
    ],
    "set/float": [
        { "type": "word", "name": "var" },
        { "type": "float", "name": "value" }
    ],
    "cast/int/str": [
        { "type": "word", "name": "var" },
        { "type": "word", "name": "sourcevar" }
    ],
    "print/var": [
        { "type": "word", "name": "var" }
    ],
    "print/str": [
        { "type": "remaining", "name": "string" }
    ],
    "test/math": [
        { "type": "expression", "name": "test" }
    ]
};