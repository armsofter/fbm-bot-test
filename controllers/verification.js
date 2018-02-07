module.exports = (req, res) => {
    console.log(JSON.stringify(req.body));
    const hubChallenge = req.query['hub.challenge'];
    const hubMode = req.query['hub.mode'];
    const verifyTokenMatches = (req.query['hub.verify_token'] === 'crowdbotics');
    if (hubMode && verifyTokenMatches) {
        res.status(200).send(hubChallenge);
    } else {
        res.status(403).end();
    }
};