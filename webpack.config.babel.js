import webpack from 'webpack'
import koutoSwiss from 'kouto-swiss'

const config = {
  entry: './index.js',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
      {
        test  : /\.styl$/,
        loader: 'style!css!stylus',
      }
    ],
  },

  stylus: {
    use: [koutoSwiss()],
  },
}

switch(process.env.npm_lifecycle_event){
  case 'build':
    config.output= {
      path: __dirname,
      filename: "bundle.js"
    }
    config.plugins= [
      new webpack.optimize.UglifyJsPlugin({compress:{warnings:false}})
    ]
    break

  default:
    config.devtool= '#source-map'
}

export default config
