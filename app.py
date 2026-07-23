from flask import Flask, render_template, redirect, url_for, request, session, flash
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta

app = Flask(__name__)
app.config['SECRET_KEY'] = 'troque-para-uma-chave-secreta'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///gerencia_acad.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)


class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha_hash = db.Column(db.String(128), nullable=False)
    perfil = db.Column(db.String(30), nullable=False)

    def verificar_senha(self, senha):
        return bcrypt.check_password_hash(self.senha_hash, senha)


class Aluno(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120), nullable=False)
    cpf = db.Column(db.String(14), unique=True, nullable=False)
    telefone = db.Column(db.String(20))
    email = db.Column(db.String(120), nullable=False)
    data_nascimento = db.Column(db.Date)
    plano_id = db.Column(db.Integer, db.ForeignKey('plano.id'))
    personal_id = db.Column(db.Integer, db.ForeignKey('usuario.id'))
    status_mensalidade = db.Column(db.String(20), default='Em dia')
    vencimento = db.Column(db.Date)
    pagamentos = db.relationship('Pagamento', backref='aluno', lazy=True)
    avaliacoes = db.relationship('AvaliacaoFisica', backref='aluno', lazy=True)
    treinos = db.relationship('Treino', backref='aluno', lazy=True)


class Plano(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120), nullable=False)
    valor = db.Column(db.Float, nullable=False)
    duracao_meses = db.Column(db.Integer, nullable=False)
    descricao = db.Column(db.Text)
    alunos = db.relationship('Aluno', backref='plano', lazy=True)


class Pagamento(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    aluno_id = db.Column(db.Integer, db.ForeignKey('aluno.id'), nullable=False)
    valor = db.Column(db.Float, nullable=False)
    data_pagamento = db.Column(db.Date, default=datetime.utcnow)
    descricao = db.Column(db.String(255))


class AvaliacaoFisica(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    aluno_id = db.Column(db.Integer, db.ForeignKey('aluno.id'), nullable=False)
    data = db.Column(db.Date, default=datetime.utcnow)
    peso = db.Column(db.Float)
    altura = db.Column(db.Float)
    imc = db.Column(db.Float)
    percentual_gordura = db.Column(db.Float)
    massa_muscular = db.Column(db.Float)
    circunferencias = db.Column(db.Text)


class Treino(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    aluno_id = db.Column(db.Integer, db.ForeignKey('aluno.id'), nullable=False)
    personal_id = db.Column(db.Integer, db.ForeignKey('usuario.id'))
    objetivo = db.Column(db.String(120))
    nivel = db.Column(db.String(120))
    frequencia_semanal = db.Column(db.Integer)
    restricoes = db.Column(db.Text)
    detalhes = db.Column(db.Text)
    data_criacao = db.Column(db.Date, default=datetime.utcnow)


@app.before_request
def checar_autenticacao():
    caminho = request.endpoint
    if caminho not in ('login', 'static') and 'usuario_id' not in session:
        return redirect(url_for('login'))
    if 'usuario_id' in session:
        session.permanent = True


@app.route('/')
def home():
    perfil = session.get('perfil')
    return render_template('dashboard.html', perfil=perfil)


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        senha = request.form['senha']
        usuario = Usuario.query.filter_by(email=email).first()
        if usuario and usuario.verificar_senha(senha):
            session['usuario_id'] = usuario.id
n            session['perfil'] = usuario.perfil
            session['nome'] = usuario.nome
            return redirect(url_for('home'))
        flash('E-mail ou senha inválidos.', 'danger')
    return render_template('login.html')


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))


@app.route('/alterar-senha', methods=['GET', 'POST'])
def alterar_senha():
    if request.method == 'POST':
        senha_atual = request.form['senha_atual']
        nova_senha = request.form['nova_senha']
        confirmacao = request.form['confirmacao']
        usuario = Usuario.query.get(session['usuario_id'])
        if not usuario.verificar_senha(senha_atual):
            flash('Senha atual incorreta.', 'danger')
        elif nova_senha != confirmacao:
            flash('Nova senha e confirmação não coincidem.', 'danger')
        else:
            usuario.senha_hash = bcrypt.generate_password_hash(nova_senha).decode('utf-8')
            db.session.commit()
            flash('Senha alterada com sucesso.', 'success')
            return redirect(url_for('home'))
    return render_template('alterar_senha.html')


@app.route('/alunos')
def listar_alunos():
    if session.get('perfil') != 'Administrador':
        return redirect(url_for('home'))
    termo = request.args.get('termo', '')
    query = Aluno.query
    if termo:
        query = query.filter((Aluno.nome.ilike(f'%{termo}%')) | (Aluno.cpf.ilike(f'%{termo}%')))
    alunos = query.all()
    return render_template('alunos.html', alunos=alunos, termo=termo)


@app.route('/alunos/novo', methods=['GET', 'POST'])
def novo_aluno():
    if session.get('perfil') != 'Administrador':
        return redirect(url_for('home'))
    planos = Plano.query.all()
    personals = Usuario.query.filter_by(perfil='Personal Trainer').all()
    if request.method == 'POST':
        aluno = Aluno(
            nome=request.form['nome'],
            cpf=request.form['cpf'],
            telefone=request.form['telefone'],
            email=request.form['email'],
            data_nascimento=datetime.strptime(request.form['data_nascimento'], '%Y-%m-%d').date() if request.form['data_nascimento'] else None,
            plano_id=request.form.get('plano_id') or None,
            personal_id=request.form.get('personal_id') or None,
            status_mensalidade='Em dia',
            vencimento=datetime.strptime(request.form['vencimento'], '%Y-%m-%d').date() if request.form['vencimento'] else None
        )
        db.session.add(aluno)
        db.session.commit()
        flash('Aluno cadastrado com sucesso.', 'success')
        return redirect(url_for('listar_alunos'))
    return render_template('aluno_form.html', planos=planos, personals=personals)


@app.route('/alunos/editar/<int:aluno_id>', methods=['GET', 'POST'])
def editar_aluno(aluno_id):
    if session.get('perfil') != 'Administrador':
        return redirect(url_for('home'))
    aluno = Aluno.query.get_or_404(aluno_id)
    planos = Plano.query.all()
    personals = Usuario.query.filter_by(perfil='Personal Trainer').all()
    if request.method == 'POST':
        aluno.nome = request.form['nome']
        aluno.cpf = request.form['cpf']
        aluno.telefone = request.form['telefone']
        aluno.email = request.form['email']
        aluno.data_nascimento = datetime.strptime(request.form['data_nascimento'], '%Y-%m-%d').date() if request.form['data_nascimento'] else None
        aluno.plano_id = request.form.get('plano_id') or None
        aluno.personal_id = request.form.get('personal_id') or None
        aluno.vencimento = datetime.strptime(request.form['vencimento'], '%Y-%m-%d').date() if request.form['vencimento'] else None
        db.session.commit()
        flash('Aluno atualizado com sucesso.', 'success')
        return redirect(url_for('listar_alunos'))
    return render_template('aluno_form.html', aluno=aluno, planos=planos, personals=personals)


@app.route('/alunos/excluir/<int:aluno_id>')
def excluir_aluno(aluno_id):
    if session.get('perfil') != 'Administrador':
        return redirect(url_for('home'))
    aluno = Aluno.query.get_or_404(aluno_id)
    db.session.delete(aluno)
    db.session.commit()
    flash('Aluno excluído com sucesso.', 'success')
    return redirect(url_for('listar_alunos'))


@app.route('/personals')
def listar_personals():
    if session.get('perfil') != 'Administrador':
        return redirect(url_for('home'))
    personals = Usuario.query.filter_by(perfil='Personal Trainer').all()
    return render_template('personals.html', personals=personals)


@app.route('/personals/novo', methods=['GET', 'POST'])
def novo_personal():
    if session.get('perfil') != 'Administrador':
        return redirect(url_for('home'))
    if request.method == 'POST':
        senha_hash = bcrypt.generate_password_hash(request.form['senha']).decode('utf-8')
        personal = Usuario(
            nome=request.form['nome'],
            email=request.form['email'],
            senha_hash=senha_hash,
            perfil='Personal Trainer'
        )
        db.session.add(personal)
        db.session.commit()
        flash('Personal Trainer cadastrado com sucesso.', 'success')
        return redirect(url_for('listar_personals'))
    return render_template('personal_form.html')


@app.route('/personals/editar/<int:personal_id>', methods=['GET', 'POST'])
def editar_personal(personal_id):
    if session.get('perfil') != 'Administrador':
        return redirect(url_for('home'))
    personal = Usuario.query.get_or_404(personal_id)
    if request.method == 'POST':
        personal.nome = request.form['nome']
        personal.email = request.form['email']
        db.session.commit()
        flash('Personal Trainer atualizado com sucesso.', 'success')
        return redirect(url_for('listar_personals'))
    return render_template('personal_form.html', personal=personal)


@app.route('/personals/excluir/<int:personal_id>')
def excluir_personal(personal_id):
    if session.get('perfil') != 'Administrador':
        return redirect(url_for('home'))
    personal = Usuario.query.get_or_404(personal_id)
    db.session.delete(personal)
    db.session.commit()
    flash('Personal Trainer excluído com sucesso.', 'success')
    return redirect(url_for('listar_personals'))


@app.route('/planos')
def listar_planos():
    if session.get('perfil') != 'Administrador':
        return redirect(url_for('home'))
    planos = Plano.query.all()
    return render_template('planos.html', planos=planos)


@app.route('/planos/novo', methods=['GET', 'POST'])
def novo_plano():
    if session.get('perfil') != 'Administrador':
        return redirect(url_for('home'))
    if request.method == 'POST':
        plano = Plano(
            nome=request.form['nome'],
            valor=float(request.form['valor']),
            duracao_meses=int(request.form['duracao_meses']),
            descricao=request.form['descricao']
        )
        db.session.add(plano)
        db.session.commit()
        flash('Plano cadastrado com sucesso.', 'success')
        return redirect(url_for('listar_planos'))
    return render_template('plano_form.html')


@app.route('/planos/editar/<int:plano_id>', methods=['GET', 'POST'])
def editar_plano(plano_id):
    if session.get('perfil') != 'Administrador':
        return redirect(url_for('home'))
    plano = Plano.query.get_or_404(plano_id)
    if request.method == 'POST':
        plano.nome = request.form['nome']
        plano.valor = float(request.form['valor'])
        plano.duracao_meses = int(request.form['duracao_meses'])
        plano.descricao = request.form['descricao']
        db.session.commit()
        flash('Plano atualizado com sucesso.', 'success')
        return redirect(url_for('listar_planos'))
    return render_template('plano_form.html', plano=plano)


@app.route('/planos/excluir/<int:plano_id>')
def excluir_plano(plano_id):
    if session.get('perfil') != 'Administrador':
        return redirect(url_for('home'))
    plano = Plano.query.get_or_404(plano_id)
    db.session.delete(plano)
    db.session.commit()
    flash('Plano excluído com sucesso.', 'success')
    return redirect(url_for('listar_planos'))


@app.route('/pagamentos')
def listar_pagamentos():
    if session.get('perfil') not in ('Administrador', 'Personal Trainer', 'Aluno'):
        return redirect(url_for('home'))
    if session.get('perfil') == 'Aluno':
        pagamentos = Pagamento.query.filter_by(aluno_id=Aluno.query.filter_by(email=session.get('email')).first().id).all()
    else:
        pagamentos = Pagamento.query.all()
    return render_template('pagamentos.html', pagamentos=pagamentos)


@app.route('/pagamentos/novo', methods=['GET', 'POST'])
def novo_pagamento():
    if session.get('perfil') != 'Administrador':
        return redirect(url_for('home'))
    alunos = Aluno.query.all()
    if request.method == 'POST':
        pagamento = Pagamento(
            aluno_id=int(request.form['aluno_id']),
            valor=float(request.form['valor']),
            data_pagamento=datetime.strptime(request.form['data_pagamento'], '%Y-%m-%d').date(),
            descricao=request.form['descricao']
        )
        db.session.add(pagamento)
        db.session.commit()
        flash('Pagamento registrado com sucesso.', 'success')
        return redirect(url_for('listar_pagamentos'))
    return render_template('pagamento_form.html', alunos=alunos)


@app.route('/avaliacoes')
def listar_avaliacoes():
    perfil = session.get('perfil')
    if perfil == 'Administrador':
        avaliacoes = AvaliacaoFisica.query.all()
    elif perfil == 'Personal Trainer':
        pessoais_ids = [a.id for a in Aluno.query.filter_by(personal_id=session['usuario_id']).all()]
        avaliacoes = AvaliacaoFisica.query.filter(AvaliacaoFisica.aluno_id.in_(pessoais_ids)).all()
    else:
        aluno = Aluno.query.filter_by(email=session.get('email')).first()
        avaliacoes = AvaliacaoFisica.query.filter_by(aluno_id=aluno.id).all() if aluno else []
    return render_template('avaliacoes.html', avaliacoes=avaliacoes)


@app.route('/avaliacoes/novo', methods=['GET', 'POST'])
def nova_avaliacao():
    if session.get('perfil') != 'Administrador':
        return redirect(url_for('home'))
    alunos = Aluno.query.all()
    if request.method == 'POST':
        avaliacao = AvaliacaoFisica(
            aluno_id=int(request.form['aluno_id']),
            data=datetime.strptime(request.form['data'], '%Y-%m-%d').date(),
            peso=float(request.form['peso']),
            altura=float(request.form['altura']),
            imc=float(request.form['imc']),
            percentual_gordura=float(request.form['percentual_gordura']),
            massa_muscular=float(request.form['massa_muscular']),
            circunferencias=request.form['circunferencias']
        )
        db.session.add(avaliacao)
        db.session.commit()
        flash('Avaliação física cadastrada com sucesso.', 'success')
        return redirect(url_for('listar_avaliacoes'))
    return render_template('avaliacao_form.html', alunos=alunos)


@app.route('/treinos')
def listar_treinos():
    perfil = session.get('perfil')
    if perfil == 'Administrador':
        treinos = Treino.query.all()
    elif perfil == 'Personal Trainer':
        treinos = Treino.query.filter_by(personal_id=session['usuario_id']).all()
    else:
        aluno = Aluno.query.filter_by(email=session.get('email')).first()
        treinos = Treino.query.filter_by(aluno_id=aluno.id).all() if aluno else []
    return render_template('treinos.html', treinos=treinos)


@app.route('/treinos/novo', methods=['GET', 'POST'])
def novo_treino():
    if session.get('perfil') != 'Personal Trainer':
        return redirect(url_for('home'))
    alunos = Aluno.query.filter_by(personal_id=session['usuario_id']).all()
    if request.method == 'POST':
        treino = Treino(
            aluno_id=int(request.form['aluno_id']),
            personal_id=session['usuario_id'],
            objetivo=request.form['objetivo'],
            nivel=request.form['nivel'],
            frequencia_semanal=int(request.form['frequencia_semanal']),
            restricoes=request.form['restricoes'],
            detalhes=request.form['detalhes']
        )
        db.session.add(treino)
        db.session.commit()
        flash('Ficha de treino criada com sucesso.', 'success')
        return redirect(url_for('listar_treinos'))
    return render_template('treino_form.html', alunos=alunos)


@app.route('/treinos/editar/<int:treino_id>', methods=['GET', 'POST'])
def editar_treino(treino_id):
    if session.get('perfil') != 'Personal Trainer':
        return redirect(url_for('home'))
    treino = Treino.query.get_or_404(treino_id)
    if treino.personal_id != session['usuario_id']:
        return redirect(url_for('home'))
    alunos = Aluno.query.filter_by(personal_id=session['usuario_id']).all()
    if request.method == 'POST':
        treino.objetivo = request.form['objetivo']
        treino.nivel = request.form['nivel']
        treino.frequencia_semanal = int(request.form['frequencia_semanal'])
        treino.restricoes = request.form['restricoes']
        treino.detalhes = request.form['detalhes']
        db.session.commit()
        flash('Ficha de treino atualizada com sucesso.', 'success')
        return redirect(url_for('listar_treinos'))
    return render_template('treino_form.html', treino=treino, alunos=alunos)


@app.route('/treinos/excluir/<int:treino_id>')
def excluir_treino(treino_id):
    if session.get('perfil') != 'Personal Trainer':
        return redirect(url_for('home'))
    treino = Treino.query.get_or_404(treino_id)
    if treino.personal_id != session['usuario_id']:
        return redirect(url_for('home'))
    db.session.delete(treino)
    db.session.commit()
    flash('Ficha de treino excluída com sucesso.', 'success')
    return redirect(url_for('listar_treinos'))


if __name__ == '__main__':
    db.create_all()
    if not Usuario.query.filter_by(email='admin@academia.com').first():
        senha_hash = bcrypt.generate_password_hash('admin123').decode('utf-8')
        administrador = Usuario(nome='Administrador', email='admin@academia.com', senha_hash=senha_hash, perfil='Administrador')
        db.session.add(administrador)
        db.session.commit()
    app.run(debug=True)
