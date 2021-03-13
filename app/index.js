const Generator = require('yeoman-generator')
const mkdirp = require('mkdirp')

const config = {
  plainFiles: [
    {
      input: 'editorconfig',
      output: '.editorconfig'
    },
    {
      input: 'gitattributes',
      output: '.gitattributes'
    },
    {
      input: 'gitignore',
      output: '.gitignore'
    },
    {
      input: 'favicon.ico',
      output: 'src/assets/favicon.ico'
    },
    {
      input: 'robots.txt',
      output: 'src/assets/robots.txt'
    },
    {
      input: 'main.less',
      output: 'src/css/main.less'
    },
    {
      input: 'webpack.config.js',
      output: 'webpack.config.js'
    },
    {
      input: 'postcss.config.js',
      output: 'postcss.config.js'
    },
    {
      input: 'eslintrc.js',
      output: '.eslintrc.js'
    },
    {
      input: 'stylelintrc.json',
      output: '.stylelintrc.json'
    }
  ],
  tplFiles: [
    {
      input: '_package.json',
      output: 'package.json'
    },
    {
      input: 'index.js',
      output: 'src/index.js'
    },
    {
      input: 'index.html',
      output: 'src/index.html'
    }
  ],
  dirs: ['dist', 'src/assets', 'src/css', 'test']
}

module.exports = class extends Generator {
  /* eslint-disable no-useless-constructor */
  constructor (args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts)
  }

  async prompting () {
    const answers = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.appname // Default to current folder name
      }
    ])

    this.log('app name', answers.name)
  }

  writing () {
    const tplData = {
      appname: this.appname,
      date: new Date().toISOString().split('T')[0]
    }

    const copy = (input, output) => {
      this.fs.copy(this.templatePath(input), this.destinationPath(output))
    }

    const copyTpl = (input, output, data) => {
      this.fs.copyTpl(
        this.templatePath(input),
        this.destinationPath(output),
        data
      )
    }

    // Render Files
    config.tplFiles.forEach(file => {
      copyTpl(file.input, file.output, tplData)
    })

    // Copy Files
    config.plainFiles.forEach(file => {
      copy(file.input, file.output)
    })

    // Create extra directories
    config.dirs.forEach(item => {
      mkdirp(item)
    })
  }

  end () {
    this.log("Run 'npm run dev' to start the development server.")
  }

  install () {
    this.installDependencies({
      npm: true,
      yarn: false,
      bower: false
    })
  }
}
