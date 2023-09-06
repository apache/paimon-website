const navHtml = `
<nav class="navbar navbar-expand-lg navbar-dark px-4 py-2 sticky-top shadow-sm" style="background: #336699">
    <a class="navbar-brand" href="https://paimon.apache.org/"><img alt="" src="assets/paimon_black.svg" width="70%"></a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse justify-content-end" id="navbarContent">
    <ul class="navbar-nav">
        <li class="nav-item active px-3">
            <a class="nav-link" href="https://paimon.apache.org/docs/master">Document</a>
        </li>
        <li class="nav-item active px-3">
            <a class="nav-link" href="https://github.com/apache/incubator-paimon/">Github</a>
        </li>
        <li class="nav-item active px-3">
            <a class="nav-link" href="https://paimon.apache.org/users.html">Who's Using</a>
        </li>
        <li class="nav-item active px-3">
            <a class="nav-link" href="https://paimon.apache.org/release-0.4.html">Releases</a>
        </li>
        <li class="nav-item dropdown px-3">
            <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Community</a>
            <div class="dropdown-menu">
                <a class="dropdown-item" href="https://paimon.apache.org/docs/master/project/contributing/">How to Contribute</a>
                <a class="dropdown-item" href="https://paimon.apache.org/team.html">Team</a>
            </div>
        </li>
        <li class="nav-item active px-3">
            <a class="nav-link" href="https://paimon.apache.org/security.html">Security</a>
        </li>
        <li class="nav-item dropdown px-3">
            <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">ASF</a>
            <div class="dropdown-menu">
                <a class="dropdown-item" href="https://www.apache.org/">Foundation</a>
                <a class="dropdown-item" href="https://www.apache.org/licenses/">License</a>
                <a class="dropdown-item" href="https://www.apache.org/events/current-event">Events</a>
                <a class="dropdown-item" href="https://www.apache.org/security/">Security</a>
                <a class="dropdown-item" href="https://www.apache.org/foundation/sponsorship.html">Sponsorship</a>
                <a class="dropdown-item" href="https://www.apache.org/foundation/thanks.html">Thanks</a>
            </div>
        </li>
    </ul>
    </div>
</nav>
`;

const footerHtml = `
<footer class="mt-auto" style="background-color: rgb(0, 1, 25);">
<div class="container pt-4">
    <div class="row d-flex align-items-center m-1">
        <div class="col-sm-12 col-lg-3 text-center"><a href="https://incubator.apache.org/"><img src="assets/apache-incubator.svg" style="max-width: 100%" /></a></div>
        <div class="col-sm-12 col-lg-9 text-white">
            <p>
            Apache Paimon is an effort undergoing incubation at The Apache Software Foundation (ASF), sponsored by the Apache Incubator.
            Incubation is required of all newly accepted projects until a further review indicates that the infrastructure, communications,
            and decision making process have stabilized in a manner consistent with other successful ASF projects.
            While incubation status is not necessarily a reflection of the completeness or stability of the code,
            it does indicate that the project has yet to be fully endorsed by the ASF.
            </p>
        </div>
    </div>
    <hr class="bg-white" />
    <div class="row mx-1">
        <div class="col-12 text-center text-white">
            <p>
            Copyright &copy; 2023 The Apache Software Foundation. Apache Paimon, Paimon, and its feather logo are trademarks of The Apache Software Foundation.
            </p>
        </div>
    </div>
</div>
</footer>
`;

function toHtmlNode(htmlString) {
    const tmpDiv = document.createElement('div');
    tmpDiv.innerHTML = htmlString.trim();
    return tmpDiv.firstChild;
}

const body = document.getElementsByTagName('body')[0];
body.insertBefore(toHtmlNode(navHtml), body.firstChild);
body.insertBefore(toHtmlNode(footerHtml), null);
