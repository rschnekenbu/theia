// *****************************************************************************
// Copyright (C) 2022 STMicroelectronics and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
// *****************************************************************************

export interface CollectionDelta<K, T> {
    added?: T[];
    removed?: K[];
}

export interface TreeDelta<K, T> {
    path: K[];
    properties?: Partial<T>;
    added?: T[];
    removed?: K[];
    changed?: TreeDelta<K, T>[];
}

class TreeDeltaBuilder<K, T> {
    currentDelta: TreeDelta<K, T>;

    reportAdded(path: K[], added: T): void {
        const targetNode = this.findNode(path);
        if (!targetNode.added) {
            targetNode.added = [];
        }
        targetNode.added.push(added);
    }

    reportRemoved(path: K[], id: K): void {
        const targetNode = this.findNode(path);
        if (!targetNode.removed) {
            targetNode.removed = [];
        }

        targetNode.removed.push(id);
    }

    reportChanged(path: K[], change: Partial<T>): void {
        const targetNode = this.findNode(path);
        targetNode.properties = { ...{}, ...targetNode.properties, ...change };
    }

    private findNode(path: K[]): TreeDelta<K, T> {
        return doFindNode(this.currentDelta, path);
    }

}

function doFindNode<K, T>(currentDelta: TreeDelta<K, T>, path: K[]): TreeDelta<K, T> {
    if (path.length === 0) {
        return currentDelta;
    }
    let index = 0;
    while (index < currentDelta.path.length && index < path.length && path[index] === currentDelta.path[index]) {
        index++;
    }
    if (index === currentDelta.path.length) {
        return doFindNode()
    }

}

