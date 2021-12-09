$(document).ready(function () {
    registerSearch();
    registerTemplate();
});

function registerSearch() {
    $("#search").submit(function (ev) {
        ev.preventDefault();
        $("#err").empty()
        const query = getQuery($("#q").val())
        if (query.err != null){
            errorNotification(query.err)
            return
        }
        $.get($(this).attr('action'), query, (data) => {
            $("#resultsBlock").html(Mustache.render(template, data));
        }).fail((err) => {
            errorNotification(handleErr(err.status))
        });
    });
}

function registerTemplate() {
    template = $("#template").html();
    Mustache.parse(template);
}

const MAX_TWEETS = 10
const VALID_REGEX = new RegExp(`^[^:]+ max:[1-9]+$`)

const getQuery = (inputText) => {
    if (inputText.length === 0){
        return {err: "Escribe algo!"}
    }
    if (!VALID_REGEX.test(inputText)) {
        return {q: inputText}
    }
    const [q, max] = inputText.split(" max:")
    if (parseInt(max) > MAX_TWEETS){
        return {err: `Pon un número en el rango [1-${MAX_TWEETS}]`}
    }
    return {q, max}
}

const errorNotification = (msg) => {
    $("#err").append("<div class='alert alert-danger' role='alert'>" + msg + "</div>")
}

const handleErr = (status) => {
    switch (status) {
        case 500: return "Es posible que estés realizando muchas peticiones en poco tiempo"
        default: return "Error al intentar recuperar los tweets"
    }
}
