document.addEventListener('DOMContentLoaded', function() {
    const spanText = document.getElementById('spanText');
    const modal = document.getElementById('myModal');
    const modalContent = document.querySelector('.modal-content');


    // Fecha o modal ao clicar na área de conteúdo do modal
    modalContent.addEventListener('click', function(event) {
        event.stopPropagation(); // Impede que o evento clique se propague para o modal
        modal.style.display = 'none';
    });

    // Fecha o modal ao clicar fora da área de conteúdo do modal
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const spanText = document.getElementById('spanText');

    spanText.addEventListener('click', function(event) {
        event.preventDefault(); // Impede a ação padrão do hyperlink
    });
});
//let n=0
//
//while (n<10){
//    console.log(n)
//    n++
//}

//function somar(){
//    let n1=2
//    let n2=10
//    let soma=n1+n2
//    console.log(soma)
//}
//
//for(let i=0;i<10;i++){
//    (somar);
//}
//let nome = prompt("Qual seu nome?");
//
//// Verifica se o usuário digitou algo ou cancelou a entrada
//if (nome !== null && nome !== "") {
//    // Obtém o elemento HTML com o id "nome"
//    const nomeElement = document.getElementById("nome");
//
//    // Define o conteúdo do elemento HTML
//    nomeElement.innerHTML = nome;
//} else {
//    alert('Nenhum nome encontrado.')
//    
//}
//

//function soma(...valores){
//    let tam=valores.length
//    let res=0
//    for(let i=0;i<tam;i++){
//        res+=valores[i]
//    }
//    return res
//}

//console.log(soma(10,20))


//let of//
//function soma2(...valores){
//    let res=0
//    for(let v of valores){
//        res+=v
//    }
//    return res
//}
//
//console.log(soma2(10,20))

//Função Contrutora Anonima//
//const f=new Function("v1","v2,","return v1+v2")

//    console.log(f(10,5))

//const soma=(n1,n2)=>n1+n2
//console.log(soma(20,10))

//const soma=(...valores)=>{
//    const somar=val=>{
//        let res=0
//        for(v of val)
//            res+=v
//        return res
//    }
//    return somar(valores)
//}
//
//console.log(soma(10,15,20))






function toggleIcons() {
    const iconContainer = document.querySelector('.icon-container2');
    const mainIcon = document.querySelector('.main-icon');

    iconContainer.classList.toggle('active');
    mainIcon.classList.toggle('rotate-icon');

    // Ajustar a altura do contêiner dos ícones conforme a visibilidade
    if (iconContainer.classList.contains('active')) {
        iconContainer.style.height = '270px'; // Ajuste conforme necessário
    } else {
        iconContainer.style.height = '90px'; // Altura original
    }
}

// Fechar os ícones quando clicar fora deles
document.addEventListener('click', function(event) {
    const iconContainer = document.querySelector('.icon-container2');
    const mainIcon = document.querySelector('.main-icon');

    // Verificar se o clique não foi dentro do ícone ou do contêiner dos ícones
    if (!iconContainer.contains(event.target) && !mainIcon.contains(event.target)) {
        iconContainer.classList.remove('active');
        mainIcon.classList.remove('rotate-icon');

        // Voltar suavemente à altura original
        iconContainer.style.height = '90px'; // Altura original
    }
});