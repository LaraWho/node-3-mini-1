module.exports = function(req,res,next) {
    const sessions = {};
    let nextSessionId = 1;

    function createSession() {
        const newSession = {};
        req.session = newSession;
        sessions[nextSessionId] = newSession;
        res.setHeader('set-cookie', 'sessionID=' + nextSessionId);
        nextSessionId++
    }

    if (req.headers.cookie) {
        //sessionId=1
        //[sessionId, 1]
        const sessionId = req.headers.cookie.split('=')[1];
        //look up session by cookie/session id
        if (sessions[sessionId]) {
            req.session = sessions[sessionId];
            res.setHeader('set-cookie', 'sessionID=' + sessionId);
        } else {
            createSession();
        }
    } else {
        createSession();
    }
    next();
};
