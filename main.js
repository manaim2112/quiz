function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;

    handleFiles(files);
}
function handleFiles(files)   {
    ([...files]).forEach(fileinput);
}

function fileinput(files) {
    let file = files;
    let reader = new FileReader();

    reader.onloadend = function(event) {
        var arrayBuffer = reader.result;
        // debugger

        mammoth.convertToHtml({arrayBuffer: arrayBuffer}).then(loadData);
    };
    reader.readAsArrayBuffer(file);
}
function loadData(data) {
    let soal = [];
    document.querySelector('.result').innerHTML = data.value;
    document.querySelectorAll('.result table tr').forEach(html => {
        let td = html.querySelectorAll('td')
        soal.push({
            soal : td[0].innerHTML,
            key : td[1].innerHTML,
            category : td[2].innerText,
            point : td[3].innerText
        });
    })
    document.querySelector('.result').innerHTML = ' ';
    loadQuiz(soal);
}
function loadQuiz(arr) {
    let quiz = document.getElementById('quiz');
    quiz.style.display = 'flex';
    arr.forEach((e, key) => {
        let btn = document.createElement('button');
        btn.classList.add('circle');
        btn.innerText = key+1;
        quiz.appendChild(btn);
    })

    document.getElementById('quiz').querySelectorAll('button').forEach(function(e, key) {
        e.addEventListener('click', (event) => {
            event.target.innerText = arr[key].category;
            let number = 0;
            var t = setInterval(function(i) {
                number += 1;
                timer(number);
                console.log(number);
                if(number > 10) {
                    
                    Swal.fire({
                        html : `<p style="font-size:25px;"> ${arr[key].soal} </p>`,
                        grow : 'fullscreen',
                        timer: 5*60*1000,
                        timerProgressBar: true,
                        showConfirmButton : false,
                        footer: '<span class="t"> </span>',
                        willOpen: () => {
                            Swal.showLoading()
                            timerInterval = setInterval(() => {
                                const content = Swal.getFooter();
                                if (content) {
                                    const b = content.querySelector('span.t');
                                    if (b) {
                                        let num = Swal.getTimerLeft();
                                        if(num < 30000) {
                                            b.textContent = num.toString().substring(0, 3);
                                        }
                                    }
                                }
                            }, 1000);
                        },
                        willClose: () => {
                            clearInterval(timerInterval)
                        }
                    }).then(function(res) {
                        if(res.isDismissed) {
                            Swal.fire('Waktu Anda Habis', 'Lihat Jawaban', 'info').then(function(r) {
                                if(r.isConfirmed) {
                                    Swal.fire({
                                        title : arr[key].key,
                                        grow : 'fullscreen'
                                    })
                                }
                            })
                        }
                    })
                    timer(number, 1);
                    clearInterval(t);
                }
            }, 1000);
        });
    });

}
function timer(number, remove = null) {
    let time = 10;
    document.querySelector('span.timer').innerText = time-number;
    if(remove !== null) {
        document.querySelector('span.timer').innerText = ' ';
    }
}