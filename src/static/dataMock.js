export const questions = [
    {
        id: '1234566',
        category: 'Literature',
        private: true,
        text: 'Which famous novelist wrote the children\'s story Chitty-Chitty-Bang-Bang?',
        selection: [
            {id: 0, text: 'Joseph Conrad'},
            {id: 1, text: 'P.L. Travers'},
            {id: 2, text: 'Ian Fleming'},
            {id: 3, text: 'J.M. Barrie'}
        ],
        correct: 2
    },{
        id: '4567899',
        category: 'Nature',
        private: true,
        text: 'What is the most venomous mammal?',
        selection: [
            'Platypus',
            'Solenodon',
            'Vampire bat'
        ],
        correct: 0
    },{
        id: '7891022',
        category: 'Art & Music',
        private: true,
        text: 'Which band had hits in 1975 with the song One of These Nights?',
        selection: [
            'Cream',
            'The Eagles'
        ],
        correct: 1
    },{
        id: '8901233',
        category: 'Literature',
        private: true,
        text: 'Who wrote the fantasy novel series A Song of Ice and Fire?',
        selection: [
            'George Lucas',
            'George Orwell',
            'George Best',
            'George R. R. Martin'
        ],
        correct: 3
    },{
        id: '9012344',
        category: 'Literature',
        private: true,
        text: 'In the Beatrix Potter books, which animal is Tommy Brock?',
        selection: [
            'Badger',
            'Rabbit',
            'Weasel',
            'Pine marten'
        ],
        correct: 0
    },{
        id: '45456456d',
        category: 'Nature',
        private: true,
        text: 'In Earth years, roughly how long is a year on Uranus?',
        selection: [
            '47',
            '62',
            '84',
            '109'
        ],
        correct: 2
    },{
        id: '0123455a',
        category: 'Nature',
        private: true,
        text: 'Why should you never hug an African crested rat?',
        selection: [
            'Its bite is venomous',
            'Its fur may be toxic',
            'Its scream could deafen you',
            'All of the above'
        ],
        correct: 1
    }
];

export const rounds = [
    {
        id: '98789',
        private: true,
        text: 'Dangerous Animals',
        selection: [
            {id: '4567899', text: 'What is the most venomous mammal?'}
        ]
    },{
        id: '65456',
        private: true,
        text: '20th Century Music',
        selection: []
    },{
        id: '32123',
        private: true,
        text: 'Books & stuff',
        selection: [
            '8901233', '1234566'
        ]
    }
];

export const quizzes = [
    {
        id: '11111',
        private: true,
        text: 'Super Quiz',
        selection: [
            '98789', '65456'
        ]
    },{
        id: '22222',
        private: true,
        text: 'Party Fun QuizThing',
        selection: ['65456']
    }
];
