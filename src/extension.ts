import * as vscode from 'vscode';
import { watchLogFiles } from './logWatcher';

export function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel('XAMPP Logs');

  const apacheLogPath = 'C:/xampp/apache/logs/error.log';  
  const mysqlLogPath = 'C:/xampp/mysql/data/mysql_error.log'; 
  const filezillaLogPath = 'C:/xampp/filezilla/logs/filezilla.log';  
  const mercuryLogPath = 'C:/xampp/mercury/logs/mercury.log';  
  const tomcatLogPath = 'C:/xampp/tomcat/logs/catalina.out';  

  let disposable = vscode.commands.registerCommand('php-logs.watch', () => {
    vscode.window.showInformationMessage('Watching XAMPP Logs...');
    watchLogFiles([apacheLogPath, mysqlLogPath, filezillaLogPath, mercuryLogPath, tomcatLogPath], outputChannel);
    outputChannel.show();
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
