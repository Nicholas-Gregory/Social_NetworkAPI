module.exports = {
    apiError: (res, err) => {
        console.error(err);
        res.status(500).send(err.message);
    }
}