import * as vscode from 'vscode';
import { watchLogFiles } from './logWatcher';

export function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel('XAMPP Logs');

  const apacheLogPath = 'C:/xampp/apache/logs/error.log';  
  const mysqlLogPath = 'C:/xampp/mysql/data/mysql_error.log'; 

  let disposable = vscode.commands.registerCommand('php-logs.watch', () => {
    vscode.window.showInformationMessage('Watching XAMPP Logs...');
    watchLogFiles([apacheLogPath, mysqlLogPath], outputChannel);
    outputChannel.show();
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
