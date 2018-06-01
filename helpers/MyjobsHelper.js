var Sequalize = require('sequelize');
var sequalize = new Sequalize(
    '',
    '',
    '', {
        logging: true,
        host: '',
        dialect: 'postgres',
        port: '5432',
        define: {
            underscored: true
        },
        pool: {
            max: 10
        }
    }
);

exports.userDataByEmail = (email, callback) => {
    console.log(email.toLocaleLowerCase());
    sequalize.query('SELECT users.username, job_seekers.id, job_alerts.id AS jID, categories.name\n' +
        'FROM users\n' +
        '  LEFT JOIN job_seekers ON users.id = job_seekers.user_id\n' +
        '  LEFT JOIN job_alerts ON job_seekers.id = job_alerts.job_seeker_id\n' +
        '  LEFT JOIN job_alert_categories ON job_alert_categories.job_alert_id = job_alerts.id\n' +
        '  LEFT JOIN categories ON job_alert_categories.category_id = categories.id\n' +
        'WHERE username = \'' + email.toLocaleLowerCase() + '\'').then((data) => {
        if (data.length) {
            callback(data[0].length, data[0][0].jid);
        }
    });
};

exports.getJobsForUser = (j_id, callback) => {
    sequalize.query('SELECT *\n' +
        'FROM job_alert_categories\n' +
        '  LEFT JOIN categories ON job_alert_categories.category_id = categories.id\n' +
        '  LEFT JOIN job_categories ON categories.id = job_categories.category_id\n' +
        '  LEFT JOIN jobs ON job_categories.job_id = jobs.id\n' +
        'WHERE job_alert_id = ' + j_id + 'ORDER BY random() LIMIT 3').then(jobs => {
        callback(jobs)
    });
};

exports.setCategory = (j_id, cat_id) => {
    sequalize.query('SELECT * FROM "job_alerts" WHERE "job_seeker_id" = ' + j_id).then((jobAlert) => {
        console.log("JOB ALERT ::::", jobAlert[0][0].id);
        sequalize.query('INSERT INTO "job_alert_categories" ("job_alert_id", "category_id") VALUES (' + jobAlert[0][0].job_seeker_id + ',' + cat_id + ')').then(jobs => {
            return jobs;
        });
    })
}

exports.getUsersCategories = (j_id) => {
    sequalize.query('SELECT job_alert_categories.*\n' +
        'FROM job_alert_categories\n' +
        '  RIGHT JOIN categories ON job_alert_categories.category_id = categories.id\n' +
        'WHERE job_alert_id = ' + j_id + '').then((categories) => {
        console.log(' CATEGORIES : ', categories[0]);
        return categories[0];
    });
};
