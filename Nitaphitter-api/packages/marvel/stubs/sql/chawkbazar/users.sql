INSERT INTO `users` (
        `id`,
        `name`,
        `email`,
        `email_verified_at`,
        `password`,
        `remember_token`,
        `created_at`,
        `updated_at`,
        `is_active`,
        `shop_id`
    )
VALUES (
        1,
        'Shop Owner',
        'vendor@demo.com',
        NULL,
        '$2y$10$5l2e.NYkxAHFeZWMOqvFoew6GjT0/0bB42wukw3I1l.trTbN951kW',
        NULL,
        '2021-10-09 16:39:49',
        '2021-11-25 06:21:22',
        1,
        NULL
    ),
    (
        3,
        'Customer',
        'customer@demo.com',
        NULL,
        '$2y$10$DeU1iilF9mg/BBqypizpZ.ysFjuIoHHIycxHmZrAvqTasTErs3P8G',
        NULL,
        '2021-11-25 06:22:18',
        '2021-11-25 06:22:18',
        1,
        NULL
    ),
    (
        4,
        'customer2',
        'customer2@demo.com',
        NULL,
        '$2y$10$UVs.WftC2iIdLQsHz9Tbdu7OmUXG3P7wyjHvJqCunyJ7JE8ekyXr.',
        NULL,
        '2022-03-17 14:15:08',
        '2022-03-17 14:15:08',
        1,
        NULL
    ),
    (
        5,
        'customer3',
        'customer3@demo.com',
        NULL,
        '$2y$10$UVs.WftC2iIdLQsHz9Tbdu7OmUXG3P7wyjHvJqCunyJ7JE8ekyXr.',
        NULL,
        '2022-03-17 16:25:39',
        '2022-03-17 16:25:39',
        1,
        NULL
    );